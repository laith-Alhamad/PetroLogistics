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
    public class CustomersController:ControllerBase
    {
        private readonly ICustomerService _customerService;

        public CustomersController(
            ICustomerService customerService)
        {
            _customerService=customerService;
        }


        // =========================================================
        // GET ALL
        // Admin + Operator
        // GET: api/customers
        // =========================================================

        [HttpGet]
        [Authorize(Roles = "Admin,Operator")]
        [ProducesResponseType(
            typeof(IEnumerable<Customer>),
            StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Customer>>>
            GetCustomers()
        {
            var customers =
                await _customerService.GetAllAsync();

            return Ok(customers);
        }


        // =========================================================
        // GET BY ID
        // Admin + Operator
        // GET: api/customers/1
        // =========================================================

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Operator")]
        [ProducesResponseType(
            typeof(Customer),
            StatusCodes.Status200OK)]
        [ProducesResponseType(
            StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Customer>>
            GetCustomer(int id)
        {
            var customer =
                await _customerService.GetByIdAsync(id);

            if(customer==null)
            {
                return NotFound();
            }

            return Ok(customer);
        }


        // =========================================================
        // CREATE
        // Admin Only
        // POST: api/customers
        // =========================================================

        [HttpPost]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(
            typeof(Customer),
            StatusCodes.Status201Created)]
        [ProducesResponseType(
            StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Customer>>
            CreateCustomer(CreateCustomerDto dto)
        {
            var createdCustomer =
                await _customerService.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetCustomer),
                new { id = createdCustomer.Id },
                createdCustomer
            );
        }


        // =========================================================
        // UPDATE
        // Admin Only
        // PUT: api/customers/5
        // =========================================================

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(
            typeof(Customer),
            StatusCodes.Status200OK)]
        [ProducesResponseType(
            StatusCodes.Status400BadRequest)]
        [ProducesResponseType(
            StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Customer>>
            UpdateCustomer(
                int id,
                UpdateCustomerDto dto)
        {
            var updatedCustomer =
                await _customerService.UpdateAsync(
                    id,
                    dto
                );

            if(updatedCustomer==null)
            {
                return NotFound();
            }

            return Ok(updatedCustomer);
        }


        // =========================================================
        // DELETE
        // Admin Only
        // DELETE: api/customers/5
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
            DeleteCustomer(int id)
        {
            var deleted =
                await _customerService.DeleteAsync(id);

            if(!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}