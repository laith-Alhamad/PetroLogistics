using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using PetroLogistics.API.Models;
using PetroLogistics.API.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PetroLogistics.API.Services
{
    public class TokenService:ITokenService
    {
        private readonly IConfiguration _configuration;
        private readonly UserManager<ApplicationUser> _userManager;

        public TokenService(
            IConfiguration configuration,
            UserManager<ApplicationUser> userManager)
        {
            _configuration=configuration;
            _userManager=userManager;
        }


        // ==========================================
        // Create JWT Token
        // ==========================================

        public async Task<string> CreateTokenAsync(
            ApplicationUser user)
        {
            // Get JWT settings
            var jwtKey = _configuration["Jwt:Key"]
                ??throw new InvalidOperationException(
                    "JWT Key is not configured."
                );

            var jwtIssuer = _configuration["Jwt:Issuer"]
                ??throw new InvalidOperationException(
                    "JWT Issuer is not configured."
                );

            var jwtAudience = _configuration["Jwt:Audience"]
                ??throw new InvalidOperationException(
                    "JWT Audience is not configured."
                );


            // Get user roles
            var roles =
                await _userManager.GetRolesAsync(user);


            // ======================================
            // Claims
            // ======================================

            var claims = new List<Claim>
            {
                new Claim(
                    ClaimTypes.NameIdentifier,
                    user.Id
                ),

                new Claim(
                    ClaimTypes.Name,
                    user.UserName ?? string.Empty
                ),

                new Claim(
                    ClaimTypes.Email,
                    user.Email ?? string.Empty
                ),

                new Claim(
                    JwtRegisteredClaimNames.Jti,
                    Guid.NewGuid().ToString()
                )
            };


            // Add roles to token
            foreach(var role in roles)
            {
                claims.Add(
                    new Claim(
                        ClaimTypes.Role,
                        role
                    )
                );
            }


            // ======================================
            // Signing Key
            // ======================================

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

            var credentials = new SigningCredentials(

                    key,
                    SecurityAlgorithms.HmacSha256
                );


            // ======================================
            // Expiration
            // ======================================

            var expireMinutes = int.TryParse(

                    _configuration["Jwt:ExpireMinutes"],
                    out var minutes
                )
                    ? minutes
                    : 60;


            // ======================================
            // Create Token
            // ======================================

            var token = new JwtSecurityToken(

                    issuer: jwtIssuer,
                    audience: jwtAudience,
                    claims: claims,
                    expires: DateTime.UtcNow.AddMinutes(
                        expireMinutes
                    ),
                    signingCredentials: credentials
                );


            // ======================================
            // Return Token String
            // ======================================

            return new JwtSecurityTokenHandler()
                .WriteToken(token);
        }
    }
}