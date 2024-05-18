namespace SchoolSystemAPI.Dtos
{
    public class SubmissionUpdateRequest
    {
        public string? FileSubmission { get; set; }
        public int? Grade { get; set; }
        public string? Comment { get; set; }
    }
}
