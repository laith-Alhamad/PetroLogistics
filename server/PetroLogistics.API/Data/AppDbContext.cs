using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PetroLogistics.API.Models;

namespace PetroLogistics.API.Data
{
    public class AppDbContext
        :IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(
            DbContextOptions<AppDbContext> options
        ) : base(options)
        {
        }

        public DbSet<Customer> Customers { get; set; }

        public DbSet<Product> Products { get; set; }

        public DbSet<Shipment> Shipments { get; set; }

        public DbSet<ShipmentStatusHistory>
            ShipmentStatusHistories
        { get; set; }


        protected override void OnModelCreating(
            ModelBuilder modelBuilder
        )
        {
            // Very important for Identity tables
            base.OnModelCreating(modelBuilder);


            // ==================================
            // Product
            // ==================================

            modelBuilder.Entity<Product>()
                .HasIndex(p => p.ProductCode)
                .IsUnique();


            // ==================================
            // Shipment
            // ==================================

            modelBuilder.Entity<Shipment>()
                .HasIndex(s => s.ShipmentNumber)
                .IsUnique();


            modelBuilder.Entity<Shipment>()
                .Property(s => s.Quantity)
                .HasPrecision(18,2);


            modelBuilder.Entity<Shipment>()
                .HasOne(s => s.Customer)
                .WithMany()
                .HasForeignKey(s => s.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<Shipment>()
                .HasOne(s => s.Product)
                .WithMany()
                .HasForeignKey(s => s.ProductId)
                .OnDelete(DeleteBehavior.Restrict);


            // ==================================
            // Shipment Status History
            // ==================================

            modelBuilder.Entity<ShipmentStatusHistory>()
                .HasOne(h => h.Shipment)
                .WithMany(s => s.StatusHistory)
                .HasForeignKey(h => h.ShipmentId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}