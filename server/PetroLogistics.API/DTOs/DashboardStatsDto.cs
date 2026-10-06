namespace PetroLogistics.API.DTOs
{
    public class DashboardStatsDto
    {
        public int TotalShipments { get; set; }

        public int PendingShipments { get; set; }

        public int InTransitShipments { get; set; }

        public int DeliveredShipments { get; set; }

        public int CancelledShipments { get; set; }

        public decimal TotalQuantity { get; set; }
    }
}
