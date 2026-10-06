namespace PetroLogistics.API.DTOs
{
    public class TopProductDto
    {
        public int ProductId { get; set; }

        public string ProductName { get; set; } = string.Empty;

        public string ProductCode { get; set; } = string.Empty;

        public int ShipmentCount { get; set; }

        public decimal TotalQuantity { get; set; }
    }
}
