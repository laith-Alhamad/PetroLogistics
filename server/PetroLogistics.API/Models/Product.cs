namespace PetroLogistics.API.Models
{
    public class Product
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string ProductCode { get; set; } = string.Empty;

        public string Category { get; set; } = string.Empty;

        public string Unit { get; set; } = string.Empty;

        public bool IsHazardous { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
