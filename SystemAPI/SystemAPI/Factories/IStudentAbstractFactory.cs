using SystemAPI.Models;

namespace SchoolSystemAPI.Factories
{
    public interface IStudentAbstractFactory
    {
        object CreateStudent(User user, Student student);
    }
}
