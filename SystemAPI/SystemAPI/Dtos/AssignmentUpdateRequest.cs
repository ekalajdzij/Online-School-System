namespace SchoolSystemAPI.Dtos
{
    public class AssignmentUpdateRequest
    {
        public string? Name { get; set; }
        public string? File { get; set; }
        public DateTime? Deadline { get; set; }
    }
}
