using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetroLogistics.API.DTOs;
using PetroLogistics.API.Models;
using PetroLogistics.API.Services.Interfaces;

namespace PetroLogistics.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController:ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(
            IProductService productService)
        {
            _productService=productService;
        }


        // =========================================================
        // GET ALL
        // Admin + Operator
        // GET: api/products
        // =========================================================

        [HttpGet]
        [Authorize(Roles = "Admin,Operator")]
        [ProducesResponseType(
            typeof(IEnumerable<Product>),
            StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Product>>>
            GetProducts()
        {
            var products =
                await _productService.GetAllAsync();

            return Ok(products);
        }


        // =========================================================
        // GET BY ID
        // Admin + Operator
        // GET: api/products/1
        // =========================================================

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Operator")]
        [ProducesResponseType(
            typeof(Product),
            StatusCodes.Status200OK)]
        [ProducesResponseType(
            StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Product>>
            GetProduct(int id)
        {
            var product =
                await _productService.GetByIdAsync(id);

            if(product==null)
            {
                return NotFound();
            }

            return Ok(product);
        }


        // =========================================================
        // CREATE
        // Admin Only
        // POST: api/products
        // =========================================================

        [HttpPost]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(
            typeof(Product),
            StatusCodes.Status201Created)]
        [ProducesResponseType(
            StatusCodes.Status400BadRequest)]
        [ProducesResponseType(
            StatusCodes.Status409Conflict)]
        public async Task<ActionResult<Product>>
            CreateProduct(CreateProductDto dto)
        {
            var createdProduct =
                await _productService.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetProduct),
                new { id = createdProduct.Id },
                createdProduct
            );
        }


        // =========================================================
        // UPDATE
        // Admin Only
        // PUT: api/products/1
        // =========================================================

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(
            typeof(Product),
            StatusCodes.Status200OK)]
        [ProducesResponseType(
            StatusCodes.Status400BadRequest)]
        [ProducesResponseType(
            StatusCodes.Status404NotFound)]
        [ProducesResponseType(
            StatusCodes.Status409Conflict)]
        public async Task<ActionResult<Product>>
            UpdateProduct(
                int id,
                UpdateProductDto dto)
        {
            var updatedProduct =
                await _productService.UpdateAsync(
                    id,
                    dto
                );

            if(updatedProduct==null)
            {
                return NotFound();
            }

            return Ok(updatedProduct);
        }


        // =========================================================
        // DELETE
        // Admin Only
        // DELETE: api/products/1
        // =========================================================

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(
            StatusCodes.Status204NoContent)]
        [ProducesResponseType(
            StatusCodes.Status404NotFound)]
        [ProducesResponseType(
            StatusCodes.Status409Conflict)]
        public async Task<IActionResult>
            DeleteProduct(int id)
        {
            var deleted =
                await _productService.DeleteAsync(id);

            if(!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}