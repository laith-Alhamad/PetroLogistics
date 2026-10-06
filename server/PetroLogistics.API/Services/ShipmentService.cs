using Microsoft.EntityFrameworkCore;
using PetroLogistics.API.Data;
using PetroLogistics.API.DTOs;
using PetroLogistics.API.Exceptions;
using PetroLogistics.API.Models;
using PetroLogistics.API.Services.Interfaces;

namespace PetroLogistics.API.Services
{
    public class ShipmentService:IShipmentService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ShipmentService> _logger;

        public ShipmentService(AppDbContext context,ILogger<ShipmentService> logger)
        {
            _context=context;
            _logger=logger;
        }


        // =========================================================
        // GET ALL
        // =========================================================
        public async Task<IEnumerable<ShipmentResponseDto>> GetAllAsync()
        {
            return await _context.Shipments
                .AsNoTracking()
                .Select(s => new ShipmentResponseDto
                {
                    Id=s.Id,
                    ShipmentNumber=s.ShipmentNumber,

                    CustomerId=s.CustomerId,
                    CustomerName=s.Customer.Name,

                    ProductId=s.ProductId,
                    ProductName=s.Product.Name,
                    ProductCode=s.Product.ProductCode,

                    Quantity=s.Quantity,
                    Origin=s.Origin,
                    Destination=s.Destination,
                    ShipmentDate=s.ShipmentDate,
                    Status=s.Status,

                    CreatedAt=s.CreatedAt,
                    UpdatedAt=s.UpdatedAt
                })
                .ToListAsync();
        }


        // =========================================================
        // GET BY ID
        // =========================================================
        public async Task<ShipmentResponseDto?> GetByIdAsync(int id)
        {
            return await _context.Shipments
                .AsNoTracking()
                .Where(s => s.Id==id)
                .Select(s => new ShipmentResponseDto
                {
                    Id=s.Id,
                    ShipmentNumber=s.ShipmentNumber,

                    CustomerId=s.CustomerId,
                    CustomerName=s.Customer.Name,

                    ProductId=s.ProductId,
                    ProductName=s.Product.Name,
                    ProductCode=s.Product.ProductCode,

                    Quantity=s.Quantity,
                    Origin=s.Origin,
                    Destination=s.Destination,
                    ShipmentDate=s.ShipmentDate,
                    Status=s.Status,

                    CreatedAt=s.CreatedAt,
                    UpdatedAt=s.UpdatedAt
                })
                .FirstOrDefaultAsync();
        }


        // =========================================================
        // CREATE
        // =========================================================
        public async Task<ShipmentResponseDto> CreateAsync(CreateShipmentDto dto,string changedBy)
        {
            // 1. Check ShipmentNumber duplication
            var shipmentNumberExists =
                await _context.Shipments
                    .AnyAsync(
                        s => s.ShipmentNumber==
                             dto.ShipmentNumber
                    );

            if(shipmentNumberExists)
            {
                throw new ConflictException(
                    $"Shipment number '{dto.ShipmentNumber}' already exists."
                );
            }


            // 2. Check Customer exists
            var customer =
                await _context.Customers
                    .FirstOrDefaultAsync(
                        c => c.Id==dto.CustomerId
                    );

            if(customer==null)
            {
                throw new NotFoundException(
                    $"Customer with ID {dto.CustomerId} does not exist."
                );
            }


            // 3. Check Product exists
            var product =
                await _context.Products
                    .FirstOrDefaultAsync(
                        p => p.Id==dto.ProductId
                    );

            if(product==null)
            {
                throw new NotFoundException(
                    $"Product with ID {dto.ProductId} does not exist."
                );
            }


            // 4. Quantity validation
            if(dto.Quantity<=0)
            {
                throw new BadRequestException(
                    "Shipment quantity must be greater than zero."
                );
            }


            // 5. Product must be active
            if(!product.IsActive)
            {
                throw new ConflictException(
                    $"Product '{product.Name}' is inactive and cannot be shipped."
                );
            }


            // 6. Get current UTC time once
            var now = DateTime.UtcNow;


            // 7. Create Shipment
            var shipment = new Shipment
            {
                ShipmentNumber=dto.ShipmentNumber,
                CustomerId=dto.CustomerId,
                ProductId=dto.ProductId,
                Quantity=dto.Quantity,
                Origin=dto.Origin,
                Destination=dto.Destination,
                ShipmentDate=dto.ShipmentDate,

                Status="Pending",

                CreatedAt=now,
                UpdatedAt=null
            };


            // 8. Add Shipment
            _context.Shipments.Add(shipment);


            // 9. Create initial Status History
            var history = new ShipmentStatusHistory
            {
                Shipment=shipment,
                Status="Pending",
                ChangedAt=now,

                // Audit Trail
                ChangedBy=changedBy
            };


            // 10. Add Status History
            _context.ShipmentStatusHistories.Add(history);


            // 11. Save
            await _context.SaveChangesAsync();

            
            //Log successful creation
            _logger.LogInformation(
                "Shipment {ShipmentNumber} created successfully by {ChangedBy}. ShipmentId: {ShipmentId}",
                shipment.ShipmentNumber,
                changedBy,
                shipment.Id
            );


            // 12. Return Response
            return new ShipmentResponseDto
            {
                Id=shipment.Id,
                ShipmentNumber=shipment.ShipmentNumber,

                CustomerId=shipment.CustomerId,
                CustomerName=customer.Name,

                ProductId=shipment.ProductId,
                ProductName=product.Name,
                ProductCode=product.ProductCode,

                Quantity=shipment.Quantity,
                Origin=shipment.Origin,
                Destination=shipment.Destination,
                ShipmentDate=shipment.ShipmentDate,
                Status=shipment.Status,

                CreatedAt=shipment.CreatedAt,
                UpdatedAt=shipment.UpdatedAt
            };
        }


        // =========================================================
        // UPDATE
        // =========================================================
        public async Task<ShipmentResponseDto?> UpdateAsync(int id,UpdateShipmentDto dto,string changedBy)

        {
            // 1. Check if shipment exists
            var shipment =
                await _context.Shipments
                    .FirstOrDefaultAsync(
                        s => s.Id==id
                    );

            if(shipment==null)
            {
                return null;
            }


            // 2. Validate shipment status
            var allowedStatuses = new[]
            {
                "Pending",
                "InTransit",
                "Delivered",
                "Cancelled"
            };

            if(!allowedStatuses.Contains(dto.Status))
            {
                throw new BadRequestException(
                    $"Invalid shipment status '{dto.Status}'."
                );
            }


            // 3. Delivered shipment cannot be changed
            if(shipment.Status=="Delivered")
            {
                throw new ConflictException(
                    "Delivered shipment cannot be modified."
                );
            }


            // 4. Cancelled shipment cannot be changed
            if(shipment.Status=="Cancelled")
            {
                throw new ConflictException(
                    "Cancelled shipment cannot be modified."
                );
            }


            // 5. Validate status transition
            bool validTransition =
                (
                    shipment.Status=="Pending"&&
                    (
                        dto.Status=="Pending"||
                        dto.Status=="InTransit"||
                        dto.Status=="Cancelled"
                    )
                )
                ||
                (
                    shipment.Status=="InTransit"&&
                    (
                        dto.Status=="InTransit"||
                        dto.Status=="Delivered"||
                        dto.Status=="Cancelled"
                    )
                );

            if(!validTransition)
            {
                throw new ConflictException(
                    $"Cannot change shipment status from "+
                    $"'{shipment.Status}' to '{dto.Status}'."
                );
            }


            // 6. Check Customer exists
            var customer =
                await _context.Customers
                    .FirstOrDefaultAsync(
                        c => c.Id==dto.CustomerId
                    );

            if(customer==null)
            {
                throw new NotFoundException(
                    $"Customer with ID {dto.CustomerId} does not exist."
                );
            }


            // 7. Check Product exists
            var product =
                await _context.Products
                    .FirstOrDefaultAsync(
                        p => p.Id==dto.ProductId
                    );

            if(product==null)
            {
                throw new NotFoundException(
                    $"Product with ID {dto.ProductId} does not exist."
                );
            }


            // 8. Product must be active
            if(!product.IsActive)
            {
                throw new ConflictException(
                    $"Product '{product.Name}' is inactive and cannot be shipped."
                );
            }


            // 9. Quantity validation
            if(dto.Quantity<=0)
            {
                throw new BadRequestException(
                    "Shipment quantity must be greater than zero."
                );
            }


            // 10. Store old status
            var oldStatus = shipment.Status;


            // 11. Get current UTC time
            var now = DateTime.UtcNow;


            // 12. Update Shipment
            shipment.CustomerId=dto.CustomerId;
            shipment.ProductId=dto.ProductId;
            shipment.Quantity=dto.Quantity;
            shipment.Origin=dto.Origin;
            shipment.Destination=dto.Destination;
            shipment.ShipmentDate=dto.ShipmentDate;
            shipment.Status=dto.Status;


            // 13. Update audit timestamp
            shipment.UpdatedAt=now;


            // 14. Add History only when status changes
            if(oldStatus!=dto.Status)
            {
                var history =
                    new ShipmentStatusHistory
                    {
                        ShipmentId=shipment.Id,
                        Status=dto.Status,
                        ChangedAt=now,

                        // Audit Trail
                        ChangedBy=changedBy
                    };

                _context
                    .ShipmentStatusHistories
                    .Add(history);
            }


            // 15. Save
            await _context.SaveChangesAsync();


            //ILogger for backend
            if(oldStatus!=dto.Status)
            {
                _logger.LogInformation(
                    "Shipment {ShipmentNumber} status changed from {OldStatus} to {NewStatus} by {ChangedBy}. ShipmentId: {ShipmentId}",
                    shipment.ShipmentNumber,
                    oldStatus,
                    dto.Status,
                    changedBy,
                    shipment.Id
                );
            }


            // 16. Return Response
            return new ShipmentResponseDto
            {
                Id=shipment.Id,
                ShipmentNumber=shipment.ShipmentNumber,

                CustomerId=shipment.CustomerId,
                CustomerName=customer.Name,

                ProductId=shipment.ProductId,
                ProductName=product.Name,
                ProductCode=product.ProductCode,

                Quantity=shipment.Quantity,
                Origin=shipment.Origin,
                Destination=shipment.Destination,
                ShipmentDate=shipment.ShipmentDate,
                Status=shipment.Status,

                CreatedAt=shipment.CreatedAt,
                UpdatedAt=shipment.UpdatedAt
            };
        }


        // =========================================================
        // CANCEL
        // =========================================================
        public async Task<ShipmentResponseDto?> CancelAsync(
            int id,
            string changedBy)
        {
            // 1. Find Shipment
            var shipment =
                await _context.Shipments
                    .FirstOrDefaultAsync(
                        s => s.Id==id
                    );

            if(shipment==null)
            {
                return null;
            }


            // 2. Delivered shipment cannot be cancelled
            if(shipment.Status=="Delivered")
            {
                throw new ConflictException(
                    "Delivered shipment cannot be cancelled."
                );
            }


            // 3. Already cancelled
            if(shipment.Status=="Cancelled")
            {
                throw new ConflictException(
                    "Shipment is already cancelled."
                );
            }


            // 4. Get current UTC time
            var now = DateTime.UtcNow;


            // 5. Change status
            shipment.Status="Cancelled";


            // 6. Update timestamp
            shipment.UpdatedAt=now;


            // 7. Create History
            var history =
                new ShipmentStatusHistory
                {
                    ShipmentId=shipment.Id,
                    Status="Cancelled",
                    ChangedAt=now,

                    // Audit Trail
                    ChangedBy=changedBy
                };


            // 8. Add History
            _context
                .ShipmentStatusHistories
                .Add(history);


            // 9. Save
            await _context.SaveChangesAsync();

            //ILogger for backend side 
            _logger.LogInformation(
                "Shipment {ShipmentNumber} cancelled by {ChangedBy}. ShipmentId: {ShipmentId}",
                shipment.ShipmentNumber,
                changedBy,
                shipment.Id
            );


            // 10. Return updated Shipment
            return await GetByIdAsync(
                shipment.Id
            );
        }


        // =========================================================
        // STATUS HISTORY
        // =========================================================
        public async Task<IEnumerable<ShipmentStatusHistoryDto>> GetStatusHistoryAsync(int shipmentId)

        {
            // 1. Check Shipment exists
            var shipmentExists =
                await _context.Shipments
                    .AnyAsync(
                        s => s.Id==shipmentId
                    );

            if(!shipmentExists)
            {
                throw new NotFoundException(
                    $"Shipment with ID {shipmentId} does not exist."
                );
            }


            // 2. Get Status History
            return await _context
                .ShipmentStatusHistories
                .AsNoTracking()
                .Where(
                    h => h.ShipmentId==shipmentId
                )
                .OrderBy(h => h.ChangedAt)
                .Select(
                    h => new ShipmentStatusHistoryDto
                    {
                        Id=h.Id,
                        Status=h.Status,
                        ChangedAt=h.ChangedAt,
                        ChangedBy=h.ChangedBy
                    }
                )
                .ToListAsync();
        }


        // =========================================================
        // SEARCH + FILTER + PAGINATION
        // =========================================================
        public async Task<PagedResultDto<ShipmentResponseDto>>
            SearchAsync(ShipmentFilterDto filter)
        {
            // 1. Validate Date Range
            if(
                filter.FromDate.HasValue&&
                filter.ToDate.HasValue&&
                filter.FromDate.Value.Date>
                filter.ToDate.Value.Date
            )
            {
                throw new BadRequestException(
                    "FromDate cannot be greater than ToDate."
                );
            }


            // 2. Start query
            var query =
                _context.Shipments
                    .AsNoTracking()
                    .AsQueryable();


            // 3. Status
            if(!string.IsNullOrWhiteSpace(filter.Status))
            {
                query=query.Where(
                    s => s.Status==filter.Status
                );
            }


            // 4. Customer
            if(filter.CustomerId.HasValue)
            {
                query=query.Where(
                    s =>
                        s.CustomerId==
                        filter.CustomerId.Value
                );
            }


            // 5. Product
            if(filter.ProductId.HasValue)
            {
                query=query.Where(
                    s =>
                        s.ProductId==
                        filter.ProductId.Value
                );
            }


            // 6. Origin
            if(!string.IsNullOrWhiteSpace(filter.Origin))
            {
                query=query.Where(
                    s =>
                        s.Origin.Contains(
                            filter.Origin
                        )
                );
            }


            // 7. Destination
            if(!string.IsNullOrWhiteSpace(
                    filter.Destination))
            {
                query=query.Where(
                    s =>
                        s.Destination.Contains(
                            filter.Destination
                        )
                );
            }


            // 8. From Date
            if(filter.FromDate.HasValue)
            {
                query=query.Where(
                    s =>
                        s.ShipmentDate>=
                        filter.FromDate.Value.Date
                );
            }


            // 9. To Date
            if(filter.ToDate.HasValue)
            {
                var nextDay =
                    filter.ToDate.Value.Date
                        .AddDays(1);

                query=query.Where(
                    s => s.ShipmentDate<nextDay
                );
            }


            // 10. Validate Pagination
            if(filter.PageNumber<1)
            {
                filter.PageNumber=1;
            }

            if(filter.PageSize<1)
            {
                filter.PageSize=10;
            }

            if(filter.PageSize>100)
            {
                filter.PageSize=100;
            }


            // 11. Total records
            var totalCount =
                await query.CountAsync();


            // 12. Total pages
            var totalPages =
                (int)Math.Ceiling(
                    totalCount/
                    (double)filter.PageSize
                );


            // 13. Pagination + Projection
            var items =
                await query
                    .OrderByDescending(
                        s => s.ShipmentDate
                    )
                    .Skip(
                        (filter.PageNumber-1)*
                        filter.PageSize
                    )
                    .Take(filter.PageSize)
                    .Select(
                        s => new ShipmentResponseDto
                        {
                            Id=s.Id,
                            ShipmentNumber=
                                s.ShipmentNumber,

                            CustomerId=
                                s.CustomerId,
                            CustomerName=
                                s.Customer.Name,

                            ProductId=
                                s.ProductId,
                            ProductName=
                                s.Product.Name,
                            ProductCode=
                                s.Product.ProductCode,

                            Quantity=
                                s.Quantity,
                            Origin=
                                s.Origin,
                            Destination=
                                s.Destination,
                            ShipmentDate=
                                s.ShipmentDate,
                            Status=
                                s.Status,

                            CreatedAt=
                                s.CreatedAt,
                            UpdatedAt=
                                s.UpdatedAt
                        }
                    )
                    .ToListAsync();


            // 14. Return result
            return new PagedResultDto<ShipmentResponseDto>
            {
                Items=items,
                PageNumber=filter.PageNumber,
                PageSize=filter.PageSize,
                TotalCount=totalCount,
                TotalPages=totalPages
            };
        }
    }
}