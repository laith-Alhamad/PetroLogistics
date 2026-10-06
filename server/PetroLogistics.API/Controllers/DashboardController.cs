using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetroLogistics.API.DTOs;
using PetroLogistics.API.Services.Interfaces;

namespace PetroLogistics.API.Controllers
{
    [Authorize(Roles = "Admin,Operator")]

    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController:ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService=dashboardService;
        }

        // GET: api/Dashboard/stats
        [HttpGet("stats")]
        [ProducesResponseType(typeof(DashboardStatsDto),StatusCodes.Status200OK)]


        public async Task<IActionResult> GetStats()
        {
            var stats = await _dashboardService.GetStatsAsync();

            return Ok(stats);
        }

        // GET: api/Dashboard/shipments-by-status
        [HttpGet("shipments-by-status")]
        [ProducesResponseType(typeof(IEnumerable<ShipmentStatusStatsDto>),StatusCodes.Status200OK)]


        public async Task<IActionResult> GetShipmentsByStatus()
        { 
            var result = await _dashboardService.GetShipmentsByStatusAsync();


            return Ok(result);
        }

        // GET: api/Dashboard/shipments-by-month
        [HttpGet("shipments-by-month")]
        [ProducesResponseType(typeof(IEnumerable<ShipmentMonthlyStatsDto>),StatusCodes.Status200OK)]

        public async Task<IActionResult> GetShipmentsByMonth()
        {
            var result = await _dashboardService.GetShipmentsByMonthAsync();


            return Ok(result);
        }

        // GET: api/Dashboard/top-destinations
        [HttpGet("top-destinations")]
        [ProducesResponseType(typeof(IEnumerable<TopDestinationDto>),StatusCodes.Status200OK)]


        public async Task<IActionResult> GetTopDestinations()
        {
            var result = await _dashboardService.GetTopDestinationsAsync();


            return Ok(result);
        }

        // GET: api/Dashboard/top-products
        [HttpGet("top-products")]
        [ProducesResponseType(typeof(IEnumerable<TopProductDto>),StatusCodes.Status200OK)]

        public async Task<IActionResult> GetTopProducts()
        {
            var result = await _dashboardService.GetTopProductsAsync();


            return Ok(result);
        }

        // GET: api/Dashboard/recent-shipments
        [HttpGet("recent-shipments")]
        [ProducesResponseType(typeof(IEnumerable<RecentShipmentDto>),StatusCodes.Status200OK)]

        public async Task<IActionResult> GetRecentShipments()
        {
            var result = await _dashboardService.GetRecentShipmentsAsync();


            return Ok(result);
        }
    }
}