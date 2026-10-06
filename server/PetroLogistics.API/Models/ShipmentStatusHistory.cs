namespace PetroLogistics.API.Models
{
    public class ShipmentStatusHistory
    {
        public int Id { get; set; }

        public int ShipmentId { get; set; }

        public string Status { get; set; } = string.Empty;

        public DateTime ChangedAt { get; set; }

        // User who performed the action
        public string ChangedBy { get; set; } = string.Empty;

        public Shipment Shipment { get; set; } = null!;
    }
}
