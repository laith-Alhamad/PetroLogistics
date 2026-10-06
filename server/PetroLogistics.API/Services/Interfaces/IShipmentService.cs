using PetroLogistics.API.DTOs;

namespace PetroLogistics.API.Services.Interfaces
{
    public interface IShipmentService
    {
        Task<IEnumerable<ShipmentResponseDto>> GetAllAsync();

        Task<ShipmentResponseDto?> GetByIdAsync(int id);

        Task<ShipmentResponseDto> CreateAsync(CreateShipmentDto dto,string changedBy);

        Task<ShipmentResponseDto?> UpdateAsync(int id,UpdateShipmentDto dto,string changedBy);

        Task<ShipmentResponseDto?> CancelAsync(int id,string changedBy);

        // Get Timeline For Specific Shipment
        Task<IEnumerable<ShipmentStatusHistoryDto>> GetStatusHistoryAsync(int shipmentId);



        // Search + Pagination + Date Range
        Task<PagedResultDto<ShipmentResponseDto>> SearchAsync(ShipmentFilterDto filter);

    }
}