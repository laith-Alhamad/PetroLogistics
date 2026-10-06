using PetroLogistics.API.DTOs;
using PetroLogistics.API.Models;

namespace PetroLogistics.API.Services.Interfaces
{
    public interface ICustomerService
    {
        Task<IEnumerable<Customer>> GetAllAsync();

        Task<Customer?> GetByIdAsync(int id);

        Task<Customer> CreateAsync(CreateCustomerDto dto);

        Task<Customer?> UpdateAsync(int id,UpdateCustomerDto dto);

        Task<bool> DeleteAsync(int id);
    }
}
