using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SystemAPI.Models
{
    public class Course
    {
        [Key]
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Overview { get; set; }
        public string? Summary { get; set; }
        [ForeignKey("Professor")]
        public int ProfessorId { get; set; }
        [ForeignKey("Assistant")]
        public int AssistantId { get; set; }


    }
}
