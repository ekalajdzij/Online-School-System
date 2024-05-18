using SystemAPI.Data;
using SystemAPI.Models;

namespace SchoolSystemAPI.Factories
{
    public class ProfessorAbstractFactory : IProfessorAbstractFactory
    {
        private readonly DataContext _context;

        public ProfessorAbstractFactory(DataContext context)
        {
            _context = context;
        }

        public object CreateProfessor(User user, Professor professor)
        {
            return new
            {
                Id = user.Id,
                Username = user.Username,
                Password = user.Password,
                Name = user.Name,
                Mail = user.Mail,
                Title = professor.Title,
            };
        }

        
    }
}
