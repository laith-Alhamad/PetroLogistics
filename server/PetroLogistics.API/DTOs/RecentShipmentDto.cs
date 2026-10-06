namespace PetroLogistics.API.DTOs
{
    public class RecentShipmentDto
    {
        public int Id { get; set; }

        public string ShipmentNumber { get; set; } = string.Empty;

        public string CustomerName { get; set; } = string.Empty;

        public string ProductName { get; set; } = string.Empty;

        public decimal Quantity { get; set; }

        public string Origin { get; set; } = string.Empty;

        public string Destination { get; set; } = string.Empty;

        public DateTime ShipmentDate { get; set; }

        public string Status { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
    }
}
