namespace SchoolSystemAPI.Dtos
{
    public class UserCreateRequest
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? Name { get; set; }
        public string? Mail { get; set; }
        public Boolean? IsAdmin { get; set; }
        public Boolean? IsProfessor { get; set; }
        public Boolean? IsStudent { get; set; }
        public Boolean? IsAssistant { get; set; }
        public string? Title { get; set; }
        public int? StudyYear { get; set; }
    }
}
