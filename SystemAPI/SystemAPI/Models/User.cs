using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace SystemAPI.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string? SecretKey { get; set; }
        public string Name { get; set; }
        public string Mail { get; set; }
        public Boolean? IsAdmin { get; set; }
        public Boolean? IsProfessor { get; set; }
        public Boolean? IsStudent { get; set; }
        public Boolean? IsAssistant { get; set; }
    }
}
