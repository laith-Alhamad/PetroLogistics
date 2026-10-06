using Microsoft.EntityFrameworkCore;
using PetroLogistics.API.Data;
using PetroLogistics.API.DTOs;
using PetroLogistics.API.Services.Interfaces;

namespace PetroLogistics.API.Services
{
    public class DashboardService:IDashboardService
    {
            
            private readonly AppDbContext _context;

            public DashboardService(AppDbContext context)
            {
                _context=context;
            }

        //.AsNoTracking() For Read-Only Transaction

        //Aggregated Function (Count + Sum)
        public async Task<DashboardStatsDto> GetStatsAsync()
          
        {

                var totalShipments = await _context.Shipments.CountAsync();

                var pendingShipments = await _context.Shipments.CountAsync(s => s.Status=="Pending");


                var inTransitShipments = await _context.Shipments.CountAsync(s => s.Status=="InTransit");


                var deliveredShipments = await _context.Shipments.CountAsync(s => s.Status=="Delivered");


                var cancelledShipments = await _context.Shipments.CountAsync(s => s.Status=="Cancelled");


                var totalQuantity = await _context.Shipments.SumAsync(s => (decimal?)s.Quantity)??0;


                return new DashboardStatsDto
                    {
                        TotalShipments=totalShipments,
                        PendingShipments=pendingShipments,
                        InTransitShipments=inTransitShipments,
                        DeliveredShipments=deliveredShipments,
                        CancelledShipments=cancelledShipments,
                        TotalQuantity=totalQuantity
                    };
            }


        //For React.js Chart
        //group the shipments that have the same status. (Same Group By In SQL Then Count)
        public async Task<IEnumerable<ShipmentStatusStatsDto>> GetShipmentsByStatusAsync()
        {
            var result = await _context.Shipments
                .AsNoTracking()
                .GroupBy(s => s.Status)
                .Select(group => new ShipmentStatusStatsDto
                {
                    Status=group.Key,
                    Count=group.Count()
                })
                .OrderByDescending(x => x.Count)
                .ToListAsync();

            return result;
        }


        //For React.js Chart
        //Monthly Status
        public async Task<IEnumerable<ShipmentMonthlyStatsDto>> GetShipmentsByMonthAsync()

        {
            var result = await _context.Shipments
                .AsNoTracking()
                //Group By (Month/Year)
                .GroupBy(s => new
                {
                    s.ShipmentDate.Year,
                    s.ShipmentDate.Month
                })

                .Select(group => new ShipmentMonthlyStatsDto
                {
                    Year=group.Key.Year,
                    Month=group.Key.Month,
                    Count=group.Count(),
                    TotalQuantity=group.Sum(s => s.Quantity)
                })

                .OrderBy(x => x.Year)
                .ThenBy(x => x.Month)

                .ToListAsync();

            return result;
        }



        //For React.js 
        //Top-Destination
        public async Task<IEnumerable<TopDestinationDto>> GetTopDestinationsAsync()
        {
            var result = await _context.Shipments
                .AsNoTracking()
                // Group shipments by destination
                .GroupBy(s => s.Destination)

                // Calculate statistics for each destination
                .Select(group => new TopDestinationDto
                {
                    Destination=group.Key,
                    ShipmentCount=group.Count(),
                    TotalQuantity=group.Sum(s => s.Quantity)
                })

                // Highest number of shipments first
                .OrderByDescending(x => x.ShipmentCount)

                // Return only top 5 destinations
                .Take(5)

                .ToListAsync();

            return result;
        }




        //For React.js 
        //Top-Product
        public async Task<IEnumerable<TopProductDto>> GetTopProductsAsync()
        {
            return await _context.Shipments
                .AsNoTracking()
                .GroupBy(s => new
                {
                    s.ProductId,
                    s.Product.Name,
                    s.Product.ProductCode
                })
                .Select(g => new TopProductDto
                {
                    ProductId=g.Key.ProductId,
                    ProductName=g.Key.Name,
                    ProductCode=g.Key.ProductCode,
                    ShipmentCount=g.Count(),
                    TotalQuantity=g.Sum(s => s.Quantity)
                })
                .OrderByDescending(x => x.TotalQuantity)
                .Take(5)
                .ToListAsync();
        }



        //For React.js 
        //Last 5 Shipments
        public async Task<IEnumerable<RecentShipmentDto>> GetRecentShipmentsAsync()
        {
            return await _context.Shipments
                .AsNoTracking()
                .OrderByDescending(s => s.CreatedAt)
                .Take(5)
                .Select(s => new RecentShipmentDto
                {
                    Id=s.Id,
                    ShipmentNumber=s.ShipmentNumber,
                    CustomerName=s.Customer.Name,
                    ProductName=s.Product.Name,
                    Quantity=s.Quantity,
                    Origin=s.Origin,
                    Destination=s.Destination,
                    ShipmentDate=s.ShipmentDate,
                    Status=s.Status,
                    CreatedAt=s.CreatedAt
                })
                .ToListAsync();
        }


    }
}
