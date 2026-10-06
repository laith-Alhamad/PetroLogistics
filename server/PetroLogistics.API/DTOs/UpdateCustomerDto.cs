using System.ComponentModel.DataAnnotations;

namespace PetroLogistics.API.DTOs
{
    public class UpdateCustomerDto
    {
        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;


        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;


        [Required]
        [MaxLength(30)]
        public string Phone { get; set; } = string.Empty;


        [Required]
        [MaxLength(100)]
        public string Country { get; set; } = string.Empty;


        [Required]
        [MaxLength(250)]
        public string Address { get; set; } = string.Empty;
    }
}
