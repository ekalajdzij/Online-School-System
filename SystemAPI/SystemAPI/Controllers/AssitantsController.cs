using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.Json;
using SchoolSystemAPI.Dtos;
using SchoolSystemAPI.Factories;
using SchoolSystemAPI.Services;
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
        private readonly IConfiguration _configuration;

        public AssitantsController(DataContext context, IAssistantAbstractFactory assistantFactory, IConfiguration configuration)
        {
            _context = context;
            _assistantFactory = assistantFactory;
            _configuration = configuration;
        }

        [HttpGet("all")]
        [Authorize(Policy = "ProfessorOrAssistantOrStudentOrAdmin")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllAssistants()
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

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
        [Authorize(Policy = "ProfessorOrAssistantOrStudentOrAdmin")]
        public async Task<ActionResult<IEnumerable<object>>> GetAssistant(int id)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            var assistant = await _context.Assistants.FirstOrDefaultAsync(a => a.Id == id);
            if (assistant == null) return NotFound("Assistant with the given id Not Found!");

            var user = await _context.Users.FindAsync(assistant.UserId);
            if (user == null) return NotFound("Assistant with the given id Not Found!");

            var obj = _assistantFactory.CreateAssistant(user, assistant);
            return Ok(obj);
        }

        [HttpPut("profile")]
        [Authorize(Policy = "AssistantOrAdmin")]
        public async Task<IActionResult> UpdateAssistantProfile(int assistantId, UserUpdateRequest payload)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            var ass = await _context.Users.FirstOrDefaultAsync(u => u.Id == assistantId);
            if (ass == null) return NotFound("Assistant not found!");
            if (payload.Username != null) ass.Username = payload.Username;
            if (payload.Password != null)
            {
                ass.Password = HashService.GetSha256Hash(payload.Password);
            }

            _context.Users.Update(ass);
            await _context.SaveChangesAsync();

            return Ok(ass);
        }
    }
}
