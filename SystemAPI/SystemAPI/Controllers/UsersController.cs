using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolSystemAPI.Dtos;
using SystemAPI.Data;
using SchoolSystemAPI.Services;
using Azure.Security.KeyVault.Certificates;
using SystemAPI.Models;

namespace SchoolSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;

        public UsersController(DataContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginRequest payload)
        {
            var hashedPassword = HashService.GetSha256Hash(payload.Password);
            var user = await _context.Users.FirstOrDefaultAsync(u => (u.Username == payload.Username || u.Mail == payload.Username) && u.Password == hashedPassword);
            if (user == null) return NotFound("User not found!");

            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            user.Token = AuthService.GenerateJwtToken(user, issuer, key);

            var response = new
            {
                user.Id,
                payload.Password,
                user.Name,
                user.Mail,
                user.Token
            };

            return Ok(response);
        }


        [HttpGet("all")]
        public async Task<IActionResult> GetUsers()
        {
            /*var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key); */

            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            /*var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key); */

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
            return Ok(user);
        }

        [HttpGet("admin")]
        public async Task<IActionResult> GetAdmin()
        {
            /*var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key); */

            var user = await _context.Users.FirstOrDefaultAsync(x => x.IsAdmin == true);
            return Ok(user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, AdminUserUpdateRequest payload)
        {
            /*var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key); */

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
            if (user == null) return NotFound("User not found!");

            user.Username = payload.Username ?? user.Username;
            user.Password = payload.Password != null ? HashService.GetSha256Hash(payload.Password) : user.Password;
            user.Name = payload.Name ?? user.Name;
            user.Mail = payload.Mail ?? user.Mail;
            user.IsAdmin = payload.IsAdmin ?? user.IsAdmin;
            user.IsProfessor = payload.IsProfessor ?? user.IsProfessor;
            user.IsStudent = payload.IsStudent ?? user.IsStudent;
            user.IsAssistant = payload.IsAssistant ?? user.IsAssistant;

            var professorExists = _context.Professors.Any(p => p.UserId == user.Id);
            var assistantExists = _context.Assistants.Any(a => a.UserId == user.Id);
            var studentExists = _context.Students.Any(s => s.UserId == user.Id);

            if (!professorExists && !assistantExists && !studentExists)
            {
                // User does not exist in any of the tables, create a new one
                if (user.IsProfessor == true)
                {
                    _context.Professors.Add(new Professor { UserId = user.Id });
                }
                else if (user.IsAssistant == true)
                {
                    _context.Assistants.Add(new Assistant { UserId = user.Id });
                }
                else if (user.IsStudent == true)
                {
                    _context.Students.Add(new Student { UserId = user.Id });
                }
            }

            await _context.SaveChangesAsync();
            return Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser(AdminUserUpdateRequest payload)
        {
            /*var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key); */

            var user = new User
            {
                Username = payload.Username,
                Password = HashService.GetSha256Hash(payload.Password),
                Name = payload.Name,
                Mail = payload.Mail,
                IsAdmin = payload.IsAdmin ?? false,
                IsProfessor = payload.IsProfessor ?? false,
                IsStudent = payload.IsStudent ?? false,
                IsAssistant = payload.IsAssistant ?? false
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            if (user.IsProfessor == true)
            {
                _context.Professors.Add(new Professor { UserId = user.Id });
            }
            else if (user.IsAssistant == true)
            {
                _context.Assistants.Add(new Assistant { UserId = user.Id });
            }
            else if (user.IsStudent == true)
            {
                _context.Students.Add(new Student { UserId = user.Id });
            }

            await _context.SaveChangesAsync();

            return Ok(user);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            /*var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key); */

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
            if (user == null) return NotFound("User not found!");

            if (user.IsAdmin ?? false)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
                return Ok("User deleted successfully.");
            }

            if (user.IsProfessor == true)
            {
                var courses = _context.Courses.Where(c => c.ProfessorId == id).ToList();
                foreach (var course in courses)
                {
                    var courseMaterials = _context.Materials.Where(cm => cm.CourseId == course.Id).ToList();
                    _context.Materials.RemoveRange(courseMaterials);
                    await _context.SaveChangesAsync();

                    var assignments = _context.Assignments.Where(a => a.CourseId == course.Id).ToList();
                    foreach (var assignment in assignments)
                    {
                        var submissions = _context.Submissions.Where(s => s.AssignmentId == assignment.Id).ToList();
                        _context.Submissions.RemoveRange(submissions);
                        await _context.SaveChangesAsync();

                        _context.Assignments.Remove(assignment);
                        await _context.SaveChangesAsync();
                    }

                    _context.Courses.Remove(course);
                    await _context.SaveChangesAsync();
                }
                _context.Professors.Remove(await _context.Professors.FirstOrDefaultAsync(p => p.UserId == id));
                await _context.SaveChangesAsync();
            }
            else if (user.IsAssistant == true)
            {
                var courses = _context.Courses.Where(c => c.AssistantId == id).ToList();
                foreach (var course in courses)
                {
                    var courseMaterials = _context.Materials.Where(cm => cm.CourseId == course.Id).ToList();
                    _context.Materials.RemoveRange(courseMaterials);
                    await _context.SaveChangesAsync();

                    var assignments = _context.Assignments.Where(a => a.CourseId == course.Id).ToList();
                    foreach (var assignment in assignments)
                    {
                        var submissions = _context.Submissions.Where(s => s.AssignmentId == assignment.Id).ToList();
                        _context.Submissions.RemoveRange(submissions);
                        await _context.SaveChangesAsync();

                        _context.Assignments.Remove(assignment);
                        await _context.SaveChangesAsync();
                    }

                    _context.Courses.Remove(course);
                    await _context.SaveChangesAsync();
                }
                _context.Assistants.Remove(await _context.Assistants.FirstOrDefaultAsync(a => a.UserId == id));
                await _context.SaveChangesAsync();
            }
            else if (user.IsStudent == true)
            {
                var submissions = _context.Submissions.Where(s => s.StudentId == id).ToList();
                _context.Submissions.RemoveRange(submissions);
                await _context.SaveChangesAsync();

                var student = await _context.Students.FirstOrDefaultAsync(s => s.UserId == id);
                _context.Students.Remove(student);
                await _context.SaveChangesAsync();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok("User deleted successfully.");
        }

    }
}
