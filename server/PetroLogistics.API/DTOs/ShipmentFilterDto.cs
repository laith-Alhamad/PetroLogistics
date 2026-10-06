using System.ComponentModel.DataAnnotations;

namespace PetroLogistics.API.DTOs
{
    public class ShipmentFilterDto
    {
        public string? Status { get; set; }

        public int? CustomerId { get; set; }

        public int? ProductId { get; set; }

        public string? Origin { get; set; }

        public string? Destination { get; set; }

        public DateTime? FromDate { get; set; }

        public DateTime? ToDate { get; set; }

        [Range(1,int.MaxValue)]
        public int PageNumber { get; set; } = 1;

        [Range(1,100)]
        public int PageSize { get; set; } = 10;
    }
}
