using PetroLogistics.API.DTOs;

namespace PetroLogistics.API.Services.Interfaces
{
    public interface IDashboardService
    {
        //Get All Data 
        Task<DashboardStatsDto> GetStatsAsync();


        //For React.js / Chart ByStatus
        Task<IEnumerable<ShipmentStatusStatsDto>> GetShipmentsByStatusAsync();

        //For React.js / Chart Monthly 
        Task<IEnumerable<ShipmentMonthlyStatsDto>> GetShipmentsByMonthAsync();

        //For React.js / Top-Destination 
        Task<IEnumerable<TopDestinationDto>> GetTopDestinationsAsync();

        //For React.js / Top-Product
        Task<IEnumerable<TopProductDto>> GetTopProductsAsync();

        //For React.js / Recent Shipments
        Task<IEnumerable<RecentShipmentDto>> GetRecentShipmentsAsync();
    }
}
