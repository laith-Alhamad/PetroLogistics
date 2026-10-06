using PetroLogistics.API.DTOs;
using PetroLogistics.API.Models;

namespace PetroLogistics.API.Services.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetAllAsync();

        Task<Product?> GetByIdAsync(int id);

        Task<Product> CreateAsync(CreateProductDto dto);

        Task<Product?> UpdateAsync(int id,UpdateProductDto dto);

        Task<bool> DeleteAsync(int id);
    }
}
