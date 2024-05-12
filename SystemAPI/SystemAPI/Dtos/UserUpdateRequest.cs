namespace SchoolSystemAPI.Dtos
{
    public class UserUpdateRequest
    {
        public int Id { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
       
    }
}
