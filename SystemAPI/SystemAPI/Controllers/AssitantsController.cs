using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.Json;
using SchoolSystemAPI.Factories;
using System.Runtime.CompilerServices;
using SystemAPI.Data;
using SystemAPI.Models;

namespace SchoolSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssitantsController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IAssistantAbstractFactory _assistantFactory;

        public AssitantsController(DataContext context, IAssistantAbstractFactory assistantFactory)
        {
            _context = context;
            _assistantFactory = assistantFactory;
        }

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllAssistants()
        {
            var assistants = await _context.Assistants.ToListAsync();
            if (assistants == null) return NotFound("Assistants not found!");

            var result = new List<object>();

            foreach (var ass in assistants)
            {
                var user = await _context.Users.FindAsync(ass.UserId);
                if (user != null) {
                    
                    var assistantObj = _assistantFactory.CreateAssistant(user,ass);
                    
                    result.Add(assistantObj);
                } 
            }
            if (result.Count == 0) return NotFound("Assistants not found!");
            else return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<object>>> GetAssistant(int id)
        {
            var assistant = await _context.Assistants.FirstOrDefaultAsync(a => a.Id == id);
            if (assistant == null) return NotFound("Assistant with the given id Not Found!");

            var user = await _context.Users.FindAsync(assistant.UserId);
            if (user == null) return NotFound("Assistant with the given id Not Found!");

            var obj = _assistantFactory.CreateAssistant(user, assistant);
            return Ok(obj);
        }

       




    }
}
