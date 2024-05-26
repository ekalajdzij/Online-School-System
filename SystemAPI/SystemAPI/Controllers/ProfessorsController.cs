using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.EntityFrameworkCore;
using SchoolSystemAPI.Dtos;
using SchoolSystemAPI.Factories;
using SchoolSystemAPI.Services;
using SystemAPI.Data;

namespace SchoolSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfessorsController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IProfessorAbstractFactory _professorFactory;
        private readonly IConfiguration _configuration;

        public ProfessorsController(DataContext context, IProfessorAbstractFactory professorFactory, IConfiguration configuration)
        {
            _context = context;
            _professorFactory = professorFactory;
            _configuration = configuration;
        }

        [HttpGet("all")]
        [Authorize(Policy = "ProfessorOrAssistantOrStudentOrAdmin")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllProfessors()
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            var professors = await _context.Professors.ToListAsync();
            if (professors == null) return NotFound();

            var result = new List<object>();

            foreach (var prof in professors)
            {
                var user = await _context.Users.FindAsync(prof.UserId);
                if (user != null)
                {
                    var professorObj = _professorFactory.CreateProfessor(user, prof);
                    result.Add(professorObj);
                }
            }
            if (result.Count == 0) return NotFound();
            else return Ok(result);
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "ProfessorOrAssistantOrStudentOrAdmin")]
        public async Task<ActionResult<IEnumerable<object>>> GetProfessor(int id)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            var user = await _context.Users.FirstOrDefaultAsync(p => p.Id == id);
            if (user == null) return NotFound();

            var professor = await _context.Professors.FirstOrDefaultAsync(p => p.UserId == id);
            if (professor == null) return NotFound();

            var obj = _professorFactory.CreateProfessor(user, professor);
            return Ok(obj);
        }

        [HttpPut("profile")]
        [Authorize(Policy = "ProfessorOrAdmin")]
        public async Task<IActionResult> UpdateProfessorProfile(int professorId, UserUpdateRequest payload)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            var professor = await _context.Users.FirstOrDefaultAsync(u => u.Id == professorId);
            if (professor == null) return NotFound();
            if (payload.Username != null) professor.Username = payload.Username;
            if (payload.Password != null)
            {
                professor.Password = HashService.GetSha256Hash(payload.Password);
            }

            _context.Users.Update(professor);
            await _context.SaveChangesAsync();

            return Ok(professor);
        }


    }
}
