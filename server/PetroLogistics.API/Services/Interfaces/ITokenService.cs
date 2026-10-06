using PetroLogistics.API.Models;

namespace PetroLogistics.API.Services.Interfaces
{
    public interface ITokenService
    {
        Task<string> CreateTokenAsync(
            ApplicationUser user
        );
    }
}