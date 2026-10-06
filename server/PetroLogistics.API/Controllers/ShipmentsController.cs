using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetroLogistics.API.DTOs;
using PetroLogistics.API.Services.Interfaces;
using System.Security.Claims;

namespace PetroLogistics.API.Controllers
{
    [Authorize(Roles = "Admin,Operator")]
    [Route("api/[controller]")]
    [ApiController]
    public class ShipmentsController:ControllerBase
    {
        private readonly IShipmentService _shipmentService;

        public ShipmentsController(
            IShipmentService shipmentService)
        {
            _shipmentService=shipmentService;
        }


        // =========================================================
        // GET ALL
        // GET: api/Shipments
        // =========================================================

        [HttpGet]
        [ProducesResponseType(
            typeof(IEnumerable<ShipmentResponseDto>),
            StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll()
        {
            var shipments =
                await _shipmentService.GetAllAsync();

            return Ok(shipments);
        }


        // =========================================================
        // GET BY ID
        // GET: api/Shipments/1
        // =========================================================

        [HttpGet("{id}")]
        [ProducesResponseType(
            typeof(ShipmentResponseDto),
            StatusCodes.Status200OK)]
        [ProducesResponseType(
            StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var shipment =
                await _shipmentService.GetByIdAsync(id);

            if(shipment==null)
            {
                return NotFound();
            }

            return Ok(shipment);
        }


        // =========================================================
        // CREATE
        // POST: api/Shipments
        // =========================================================

        [HttpPost]
        [ProducesResponseType(
            typeof(ShipmentResponseDto),
            StatusCodes.Status201Created)]
        [ProducesResponseType(
            StatusCodes.Status400BadRequest)]
        [ProducesResponseType(
            StatusCodes.Status404NotFound)]
        [ProducesResponseType(
            StatusCodes.Status409Conflict)]
        public async Task<IActionResult> Create(
            CreateShipmentDto dto)
        {
            var changedBy = GetCurrentUserEmail();

            var shipment =
                await _shipmentService.CreateAsync(
                    dto,
                    changedBy
                );

            return CreatedAtAction(
                nameof(GetById),
                new { id = shipment.Id },
                shipment
            );
        }


        // =========================================================
        // UPDATE
        // PUT: api/Shipments/1
        // =========================================================

        [HttpPut("{id}")]
        [ProducesResponseType(
            typeof(ShipmentResponseDto),
            StatusCodes.Status200OK)]
        [ProducesResponseType(
            StatusCodes.Status400BadRequest)]
        [ProducesResponseType(
            StatusCodes.Status404NotFound)]
        [ProducesResponseType(
            StatusCodes.Status409Conflict)]
        public async Task<IActionResult> Update(
            int id,
            UpdateShipmentDto dto)
        {
            var changedBy = GetCurrentUserEmail();

            var shipment =
                await _shipmentService.UpdateAsync(
                    id,
                    dto,
                    changedBy
                );

            if(shipment==null)
            {
                return NotFound();
            }

            return Ok(shipment);
        }


        // =========================================================
        // CANCEL
        // PATCH: api/Shipments/1/cancel
        // =========================================================

        [HttpPatch("{id}/cancel")]
        [ProducesResponseType(
            typeof(ShipmentResponseDto),
            StatusCodes.Status200OK)]
        [ProducesResponseType(
            StatusCodes.Status404NotFound)]
        [ProducesResponseType(
            StatusCodes.Status409Conflict)]
        public async Task<IActionResult> Cancel(int id)
        {
            var changedBy = GetCurrentUserEmail();

            var shipment =
                await _shipmentService.CancelAsync(
                    id,
                    changedBy
                );

            if(shipment==null)
            {
                return NotFound();
            }

            return Ok(shipment);
        }


        // =========================================================
        // STATUS HISTORY
        // GET: api/Shipments/1/history
        // =========================================================

        [HttpGet("{id}/history")]
        [ProducesResponseType(
            typeof(IEnumerable<ShipmentStatusHistoryDto>),
            StatusCodes.Status200OK)]
        [ProducesResponseType(
            StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetStatusHistory(
            int id)
        {
            var history =
                await _shipmentService
                    .GetStatusHistoryAsync(id);

            return Ok(history);
        }


        // =========================================================
        // SEARCH
        // GET: api/Shipments/search
        // =========================================================

        [HttpGet("search")]
        [ProducesResponseType(
            typeof(PagedResultDto<ShipmentResponseDto>),
            StatusCodes.Status200OK)]
        [ProducesResponseType(
            StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Search(
            [FromQuery] ShipmentFilterDto filter)
        {
            var shipments =
                await _shipmentService
                    .SearchAsync(filter);

            return Ok(shipments);
        }


        // =========================================================
        // CURRENT AUTHENTICATED USER
        // =========================================================

        private string GetCurrentUserEmail()
        {
            return User.FindFirst(
                       ClaimTypes.Email
                   )?.Value
                   ??User.Identity?.Name
                   ??"Unknown";
        }
    }
}