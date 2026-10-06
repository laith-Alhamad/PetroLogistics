namespace PetroLogistics.API.Models
{
    public class Shipment
    {
        public int Id { get; set; }

        public string ShipmentNumber { get; set; } = string.Empty;

        public int CustomerId { get; set; }

        public int ProductId { get; set; }

        public decimal Quantity { get; set; }

        public string Origin { get; set; } = string.Empty;

        public string Destination { get; set; } = string.Empty;

        public DateTime ShipmentDate { get; set; }

        public string Status { get; set; } = string.Empty;




        // Navigation Properties (To Can Make Relations Between Tables)
        public Customer Customer { get; set; } = null!;

        public Product Product { get; set; } = null!;

        //يعني أن الشحنة الواحدة يمكن أن يكون لها عدة سجلات One-to-Many 
        //(وصل، معلق، ألغي)
        public ICollection<ShipmentStatusHistory> StatusHistory { get; set; } = new List<ShipmentStatusHistory>();


        
        // One Shipment can have many status history records
        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

    }
}
