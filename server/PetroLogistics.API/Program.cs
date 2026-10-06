using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using PetroLogistics.API.Data;
using PetroLogistics.API.Exceptions;
using PetroLogistics.API.Models;
using PetroLogistics.API.Services;
using PetroLogistics.API.Services.Interfaces;
using System.Text;

var builder = WebApplication.CreateBuilder(args);


// ======================================================
// Controllers
// ======================================================

builder.Services.AddControllers();


// ======================================================
// Database - SQL Server
// ======================================================

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));


// ======================================================
// Identity
// ApplicationUser (Users)
// IdentityRole (Admin / Operator)
// ======================================================

builder.Services.AddIdentity<ApplicationUser,IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();


// ======================================================
// JWT Authentication
// ======================================================

var jwtKey = builder.Configuration["Jwt:Key"]
    ??throw new InvalidOperationException(
        "JWT Key is not configured."
    );

var jwtIssuer = builder.Configuration["Jwt:Issuer"]
    ??throw new InvalidOperationException(
        "JWT Issuer is not configured."
    );

var jwtAudience = builder.Configuration["Jwt:Audience"]
    ??throw new InvalidOperationException(
        "JWT Audience is not configured."
    );


builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme=
            JwtBearerDefaults.AuthenticationScheme;

        options.DefaultChallengeScheme=
            JwtBearerDefaults.AuthenticationScheme;

        options.DefaultScheme=
            JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters=
            new TokenValidationParameters
            {
                ValidateIssuer=true,
                ValidateAudience=true,
                ValidateLifetime=true,
                ValidateIssuerSigningKey=true,

                ValidIssuer=jwtIssuer,
                ValidAudience=jwtAudience,

                IssuerSigningKey=
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey)
                    ),

                ClockSkew=TimeSpan.Zero
            };
    });


// ======================================================
// Dependency Injection
// ======================================================

// Customer Service
builder.Services.AddScoped<ICustomerService,CustomerService>();

// Product Service
builder.Services.AddScoped<IProductService,ProductService>();

// Shipment Service
builder.Services.AddScoped<IShipmentService,ShipmentService>();

// Dashboard Service
builder.Services.AddScoped<IDashboardService,DashboardService>();

// Token Service
builder.Services.AddScoped<ITokenService,TokenService>();


// ======================================================
// Global Exception Handling
// ======================================================

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

builder.Services.AddProblemDetails();


// ======================================================
// CORS - React Application
// ======================================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp",policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "http://localhost:3000"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


// ======================================================
// Swagger
// ======================================================

builder.Services.AddEndpointsApiExplorer();

// ======================================================
// Swagger
// ======================================================

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    // JWT Bearer definition
    options.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            Type=SecuritySchemeType.Http,
            Scheme="bearer",
            BearerFormat="JWT",
            Description="Enter your JWT token."
        }
    );

    // Apply JWT authentication to Swagger
    options.AddSecurityRequirement(document =>
        new OpenApiSecurityRequirement
        {
            [
                new OpenApiSecuritySchemeReference(
                    "Bearer",
                    document
                )
            ]= []
        }
    );
});

//    options.AddSecurityRequirement(
//        new OpenApiSecurityRequirement
//        {
//            {
//                new OpenApiSecurityScheme
//                {
//                    Reference =
//                        new OpenApiReference
//                        {
//                            Type =
//                                ReferenceType.SecurityScheme,

//                            Id = "Bearer"
//                        }
//                },

//                Array.Empty<string>()
//            }
//        }
//    );
//});


// ======================================================
// Build Application
// ======================================================

var app = builder.Build();


// ======================================================
// Global Exception Handler
// ======================================================

app.UseExceptionHandler();


// ======================================================
// Swagger
// ======================================================

if(app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// ======================================================
// HTTPS
// ======================================================

app.UseHttpsRedirection();


// ======================================================
// CORS
// ======================================================

app.UseCors("ReactApp");


// ======================================================
// Authentication
// ======================================================

app.UseAuthentication();


// ======================================================
// Authorization
// ======================================================

app.UseAuthorization();


// ======================================================
// Controllers
// ======================================================

app.MapControllers();


// ======================================================
// Run Application
// ======================================================

app.Run();