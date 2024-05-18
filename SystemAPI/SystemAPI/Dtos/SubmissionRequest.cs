using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SchoolSystemAPI.Dtos
{
    public class SubmissionRequest
    {
        public int StudentId { get; set; }
        public int AssignmentId { get; set; }
        public int? Grade { get; set; }
        public string? Comment { get; set; }
        public string? FileSubmission { get; set; }
    }
}
