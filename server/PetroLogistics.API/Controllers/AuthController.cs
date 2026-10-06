using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PetroLogistics.API.DTOs;
using PetroLogistics.API.Models;
using PetroLogistics.API.Services.Interfaces;

namespace PetroLogistics.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController:ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ITokenService _tokenService;
        private readonly IConfiguration _configuration;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ITokenService tokenService,
            IConfiguration configuration)
        {
            _userManager=userManager;
            _roleManager=roleManager;
            _tokenService=tokenService;
            _configuration=configuration;
        }


        // ==========================================
        // Register
        // ==========================================
        [Authorize(Roles = "Admin")]
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)

        {
            var existingUser =
                await _userManager.FindByEmailAsync(
                    dto.Email
                );

            if(existingUser!=null)
            {
                return Conflict(new
                {
                    message = "User already exists."
                });
            }


            var allowedRoles = new[]
            {
                "Admin",
                "Operator"
            };

            if(!allowedRoles.Contains(dto.Role))
            {
                return BadRequest(new
                {
                    message =
                        "Role must be Admin or Operator."
                });
            }


            if(!await _roleManager.RoleExistsAsync(
                    dto.Role))
            {
                var roleResult =
                    await _roleManager.CreateAsync(
                        new IdentityRole(dto.Role)
                    );

                if(!roleResult.Succeeded)
                {
                    return BadRequest(
                        roleResult.Errors
                    );
                }
            }


            var user = new ApplicationUser
            {
                UserName=dto.Email,
                Email=dto.Email
            };


            var result =
                await _userManager.CreateAsync(
                    user,
                    dto.Password
                );


            if(!result.Succeeded)
            {
                return BadRequest(
                    result.Errors
                );
            }


            var addRoleResult =
                await _userManager.AddToRoleAsync(
                    user,
                    dto.Role
                );


            if(!addRoleResult.Succeeded)
            {
                return BadRequest(
                    addRoleResult.Errors
                );
            }


            return Ok(new
            {
                message =
                    "User registered successfully.",

                email = user.Email,

                role = dto.Role
            });
        }


        // ==========================================
        // Login
        // ==========================================

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            // Find user by email
            var user =
                await _userManager.FindByEmailAsync(
                    dto.Email
                );


            // User does not exist
            if(user==null)
            {
                return Unauthorized(new
                {
                    message =
                        "Invalid email or password."
                });
            }


            // Check password
            var passwordValid =
                await _userManager.CheckPasswordAsync(
                    user,
                    dto.Password
                );


            // Wrong password
            if(!passwordValid)
            {
                return Unauthorized(new
                {
                    message =
                        "Invalid email or password."
                });
            }


            // Get roles
            var roles =
                await _userManager.GetRolesAsync(user);


            var role =
                roles.FirstOrDefault()
                ??string.Empty;


            // Create JWT
            var token =
                await _tokenService.CreateTokenAsync(
                    user
                );


            // Get expiration setting
            var expireMinutes =
                int.TryParse(
                    _configuration[
                        "Jwt:ExpireMinutes"
                    ],
                    out var minutes
                )
                    ? minutes
                    : 60;


            var expiresAt =
                DateTime.UtcNow.AddMinutes(
                    expireMinutes
                );


            // Return authentication response
            var response =
                new AuthResponseDto
                {
                    Token=token,

                    Email=
                        user.Email
                        ??string.Empty,

                    Role=role,

                    ExpiresAt=expiresAt
                };


            return Ok(response);
        }
    }
}