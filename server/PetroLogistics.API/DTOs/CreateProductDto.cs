using System.ComponentModel.DataAnnotations;

namespace PetroLogistics.API.DTOs
{
    public class CreateProductDto
    {
        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;


        [Required]
        [MaxLength(50)]
        public string ProductCode { get; set; } = string.Empty;


        [Required]
        [MaxLength(100)]
        public string Category { get; set; } = string.Empty;


        [Required]
        [MaxLength(50)]
        public string Unit { get; set; } = string.Empty;


        public bool IsHazardous { get; set; }


        public bool IsActive { get; set; } = true;
    }
}
