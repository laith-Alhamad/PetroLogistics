using System.ComponentModel.DataAnnotations;

namespace PetroLogistics.API.DTOs
{
    public class UpdateShipmentDto
    {
        [Range(1,int.MaxValue)]
        public int CustomerId { get; set; }


        [Range(1,int.MaxValue)]
        public int ProductId { get; set; }


        [Range(typeof(decimal),"0.01","9999999999999999.99")]
        public decimal Quantity { get; set; }


        [Required]
        [MaxLength(150)]
        public string Origin { get; set; } = string.Empty;


        [Required]
        [MaxLength(150)]
        public string Destination { get; set; } = string.Empty;


        public DateTime ShipmentDate { get; set; }


        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = string.Empty;
    }
}
