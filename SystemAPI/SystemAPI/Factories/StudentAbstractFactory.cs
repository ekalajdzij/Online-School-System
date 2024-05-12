using SystemAPI.Data;
using SystemAPI.Models;

namespace SchoolSystemAPI.Factories
{
    public class StudentAbstractFactory : IStudentAbstractFactory
    {
        private readonly DataContext _context;

        public StudentAbstractFactory(DataContext context)
        {
            _context = context;
        }

        public object CreateStudent(User user, Student student)
        {
            return new
            {
                Username = user.Username,
                Password = user.Password,
                Name = user.Name,
                Mail = user.Mail,
                StudyYear = student.StudyYear,
            };
        }
    }
}
