namespace PetroLogistics.API.DTOs
{
    public class ShipmentMonthlyStatsDto
    {
        public int Year { get; set; }

        public int Month { get; set; }

        public int Count { get; set; }

        public decimal TotalQuantity { get; set; }
    }
}
