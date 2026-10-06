using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetroLogistics.API.Migrations
{
    /// <inheritdoc />
    public partial class AddShipmentAuditFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. Add CreatedAt temporarily as nullable
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Shipments",
                type: "datetime2",
                nullable: true);

            // 2. Add UpdatedAt as nullable
            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Shipments",
                type: "datetime2",
                nullable: true);

            // 3. Give existing shipments an initial CreatedAt value
            migrationBuilder.Sql(@"
        UPDATE Shipments
        SET CreatedAt = ShipmentDate
        WHERE CreatedAt IS NULL
    ");

            // 4. Make CreatedAt NOT NULL
            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Shipments",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Shipments");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Shipments");
        }
    }
}
