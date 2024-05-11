using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SystemAPI.Migrations
{
    /// <inheritdoc />
    public partial class DbUpdateOne : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Students");

            migrationBuilder.DropTable(
                name: "Professors");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            
        }
    }
}
