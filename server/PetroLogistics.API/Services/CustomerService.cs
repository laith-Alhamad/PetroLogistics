using Microsoft.EntityFrameworkCore;
using PetroLogistics.API.Data;
using PetroLogistics.API.DTOs;
using PetroLogistics.API.Exceptions;
using PetroLogistics.API.Models;
using PetroLogistics.API.Services.Interfaces;

namespace PetroLogistics.API.Services
{
    public class CustomerService:ICustomerService
    {

        //Connect With AppDbContext
        private readonly AppDbContext _context;

        public CustomerService(AppDbContext context)
        {
            _context=context;
        }


        public async Task<IEnumerable<Customer>> GetAllAsync()
        {
            return await _context.Customers.ToListAsync();
        }

        public async Task<Customer?> GetByIdAsync(int id)
        {
            return await _context.Customers.FindAsync(id);
        }


        public async Task<Customer> CreateAsync(CreateCustomerDto dto)
        {
            var customer = new Customer
            {
                Name=dto.Name,
                Email=dto.Email,
                Phone=dto.Phone,
                Country=dto.Country,
                Address=dto.Address
            };

            _context.Customers.Add(customer);

            await _context.SaveChangesAsync();

            return customer;
        }

        public async Task<Customer?> UpdateAsync(int id,UpdateCustomerDto customer)
        {
            var existingCustomer = await _context.Customers.FindAsync(id);

            if(existingCustomer==null)
                return null;

            existingCustomer.Name=customer.Name;
            existingCustomer.Email=customer.Email;
            existingCustomer.Phone=customer.Phone;
            existingCustomer.Country=customer.Country;
            existingCustomer.Address=customer.Address;

            await _context.SaveChangesAsync();

            return existingCustomer;
        }

       

        public async Task<bool> DeleteAsync(int id)
        {
            var customer = await _context.Customers.FindAsync(id);

            if(customer==null)
                return false;

            var hasShipments = await _context.Shipments
                .AnyAsync(s => s.CustomerId==id);

            if(hasShipments)
                throw new ConflictException("Customer cannot be deleted because they have existing shipments.");


            _context.Customers.Remove(customer);

            await _context.SaveChangesAsync();

            return true;
        }

    }
}
