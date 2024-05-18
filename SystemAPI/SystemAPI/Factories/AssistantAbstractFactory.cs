using SystemAPI.Data;
using SystemAPI.Models;

namespace SchoolSystemAPI.Factories
{
    public class AssistantAbstractFactory : IAssistantAbstractFactory
    {
        private readonly DataContext _context;

        public AssistantAbstractFactory(DataContext context)
        {
            _context = context;
        }

        public object CreateAssistant(User user, Assistant assistant)
        {
            return new
            {
                Id = user.Id,
                Username = user.Username,
                Password = user.Password,
                Name = user.Name,
                Mail = user.Mail,
                Title = assistant.Title,
                StudyYear = assistant.StudyYear
            };
        }
    }
}
