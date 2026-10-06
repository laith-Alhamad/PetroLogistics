using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetroLogistics.API.Migrations
{
    /// <inheritdoc />
    public partial class AddChangedByToShipmentStatusHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ChangedBy",
                table: "ShipmentStatusHistories",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChangedBy",
                table: "ShipmentStatusHistories");
        }
    }
}
