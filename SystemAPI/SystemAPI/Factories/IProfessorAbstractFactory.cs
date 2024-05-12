using SystemAPI.Models;

namespace SchoolSystemAPI.Factories
{
    public interface IProfessorAbstractFactory
    {
        object CreateProfessor(User user, Professor professor);
    }
}
