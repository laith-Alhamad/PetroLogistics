using Microsoft.EntityFrameworkCore;
using PetroLogistics.API.Data;
using PetroLogistics.API.DTOs;
using PetroLogistics.API.Models;
using PetroLogistics.API.Exceptions;
using PetroLogistics.API.Services.Interfaces;

namespace PetroLogistics.API.Services
{
    public class ProductService:IProductService
    {

        private readonly AppDbContext _context;

        public ProductService(AppDbContext context)
        {
            _context=context;
        }


        public async Task<Product> CreateAsync(CreateProductDto dto)
        {
            // (Business Rule In Service) Check if ProductCode already exists
            var codeExists = await _context.Products.AnyAsync(p => p.ProductCode==dto.ProductCode);


            if(codeExists)
            {
                throw new ConflictException($"Product code '{dto.ProductCode}' already exists.");

            }

            var product = new Product
            {
                Name=dto.Name,
                ProductCode=dto.ProductCode,
                Category=dto.Category,
                Unit=dto.Unit,
                IsHazardous=dto.IsHazardous,
                IsActive=dto.IsActive
            };

            _context.Products.Add(product);

            await _context.SaveChangesAsync();

            return product;
        }

        

         

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            return await _context.Products
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _context.Products
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id==id);
        }

        public async Task<Product?> UpdateAsync(int id,UpdateProductDto dto)


        {
            var product = await _context.Products.FindAsync(id);

            if(product==null)
                return null;

            // Check if another product already uses this ProductCode
            var codeExists = await _context.Products.AnyAsync(p => p.ProductCode==dto.ProductCode&&p.Id!=id);


            if(codeExists)
            {
                throw new ConflictException($"Product code '{dto.ProductCode}' already exists.");
            }

            product.Name=dto.Name;
            product.ProductCode=dto.ProductCode;
            product.Category=dto.Category;
            product.Unit=dto.Unit;
            product.IsHazardous=dto.IsHazardous;
            product.IsActive=dto.IsActive;

            await _context.SaveChangesAsync();

            return product;
        }



        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if(product==null)
                return false;

            var hasShipments = await _context.Shipments
                .AnyAsync(s => s.ProductId==id);

            if(hasShipments)
            {
                throw new ConflictException("Product cannot be deleted because it is used in existing shipments.");

            }

            _context.Products.Remove(product);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
