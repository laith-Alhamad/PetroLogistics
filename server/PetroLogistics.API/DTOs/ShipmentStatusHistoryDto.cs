namespace PetroLogistics.API.DTOs
{
    public class ShipmentStatusHistoryDto
    {
        public int Id { get; set; }

        public string Status { get; set; } = string.Empty;

        public DateTime ChangedAt { get; set; }

        public string ChangedBy { get; set; } = string.Empty;

    }
}
