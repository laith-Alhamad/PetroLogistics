namespace PetroLogistics.API.DTOs
{
    public class TopDestinationDto
    {
        public string Destination { get; set; } = string.Empty;

        public int ShipmentCount { get; set; }

        public decimal TotalQuantity { get; set; }
    }
}
