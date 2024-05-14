using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolSystemAPI.Dtos
{
    public class CourseUpdateRequest
    {
        public string? Name { get; set; }
        public string? Overview { get; set; }
        public string? Summary { get; set; }
        [ForeignKey("Professor")]
        public int? ProfessorId { get; set; }
        [ForeignKey("Assistant")]
        public int? AssistantId { get; set; }
    }
}
