using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SystemAPI.Models
{
    public class Submission
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("Student")]
        public int StudentId { get; set; }
        [ForeignKey("Assignment")]
        public int AssignmentId { get; set; }
        public int? Grade { get; set; }
        public string? Comment { get; set; }
        public string? FileSubmission { get; set; }
    }
}
