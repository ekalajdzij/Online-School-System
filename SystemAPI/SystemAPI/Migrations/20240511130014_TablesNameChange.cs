using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SystemAPI.Migrations
{
    /// <inheritdoc />
    public partial class TablesNameChange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(
                name: "Assistant",
                newName: "Assistants");

            migrationBuilder.RenameTable(
                name: "Professor",
                newName: "Professors");

            migrationBuilder.RenameTable(
                name: "Student",
                newName: "Students");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(
                name: "Assistants",
                newName: "Assistant");

            migrationBuilder.RenameTable(
                name: "Professors",
                newName: "Professor");

            migrationBuilder.RenameTable(
                name: "Students",
                newName: "Student");
        }
    }
}
