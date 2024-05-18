using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SystemAPI.Models
{
    public class Assignment
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("Professor")]
        public int ProfessorId { get; set; }
        [ForeignKey("Course")]
        public int CourseId { get; set; }
        [ForeignKey("Assistant")]
        public int AssistantId { get; set;}
        public DateTime? Deadline { get; set; }
        public string? Name { get; set; }
        public string? FileAssignment { get; set; }

    }
}
