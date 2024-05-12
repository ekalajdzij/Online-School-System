using Microsoft.Extensions.ObjectPool;
using SystemAPI.Models;

namespace SchoolSystemAPI.Factories
{
    public interface IAssistantAbstractFactory
    {
       object CreateAssistant(User user, Assistant assistant);
    }
}
