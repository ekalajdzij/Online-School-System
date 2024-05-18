using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolSystemAPI.Dtos
{
    public class AssignmentRequest
    {
        [Required]
        public List<int> ProfessorId { get; set; }
        [Required]
        public int CourseId { get; set; }
        public List<int>? AssistantId { get; set; }
        public DateTime? Deadline { get; set; }
        public string? Name { get; set; }
        public string? FileAssignment { get; set; }
    }
}
