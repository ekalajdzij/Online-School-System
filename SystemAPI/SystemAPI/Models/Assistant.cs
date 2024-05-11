using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SystemAPI.Models
{
    public class Assistant
    {
        [Key]
        public int Id { get; set; }
        public string? Title { get; set; }
        public int? StudyYear { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
    }
}
