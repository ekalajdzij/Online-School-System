using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Configuration;
using SchoolSystemAPI.Dtos;
using SchoolSystemAPI.Factories;
using SchoolSystemAPI.Services;
using SystemAPI.Data;
using SystemAPI.Models;

namespace SchoolSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IStudentAbstractFactory _studentFactory;
        private readonly IConfiguration _configuration;

        public StudentsController(DataContext context, IStudentAbstractFactory studentFactory, IConfiguration configuration)
        {
            _context = context;
            _studentFactory = studentFactory;
            _configuration = configuration;
        }

        [HttpGet("all")]
        [Authorize(Policy = "ProfessorOrAssistantOrStudentOrAdmin")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllStudents()
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            var students = await _context.Students.ToListAsync();
            if (students == null) return NotFound();

            var groupedStudents = students.GroupBy(s => s.UserId)
                                  .Select(g => g.First())
                                  .ToList();
            var result = new List<object>();

            foreach (var student in groupedStudents)
            {
                var user = await _context.Users.FindAsync(student.UserId);
                if (user != null)
                {
                    var studentObj = _studentFactory.CreateStudent(user, student);
                    result.Add(studentObj);
                }
            }
            if (result.Count == 0) return NotFound();
            else return Ok(result);
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "ProfessorOrAssistantOrStudentOrAdmin")]
        public async Task<ActionResult<IEnumerable<object>>> GetStudent(int id)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            var student = await _context.Students.FirstOrDefaultAsync(s => s.Id == id);
            if (student == null) return NotFound();

            var user = await _context.Users.FindAsync(student.UserId);
            if (user == null) return NotFound();

            var obj = _studentFactory.CreateStudent(user, student);
            return Ok(obj);
        }

        [HttpPut("enroll")]
        [Authorize(Policy = "StudentOrAdmin")]
        public async Task<ActionResult> EnrollStudent(int studentId, int courseId)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            var student = await _context.Students.FirstOrDefaultAsync(s => s.Id == studentId);
            if (student == null) return NotFound();

            var course = await _context.Courses.FirstOrDefaultAsync(c => c.Id == courseId);
            if (course == null) return NotFound();

            if (student.CourseId == courseId)
            {
                return Conflict();
            }
            var studentTemp = new Student();
            studentTemp.StudyYear = student.StudyYear;
            studentTemp.UserId = student.UserId;
            studentTemp.CourseId = courseId;
            _context.Add(studentTemp);
            _context.SaveChanges();

            return Ok();
        }

        [HttpPut("profile")]
        [Authorize(Policy = "StudentOrAdmin")]
        public async Task<IActionResult> UpdateStudentProfile(int studentId, UserUpdateRequest payload)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            var student = await _context.Users.FirstOrDefaultAsync(u => u.Id == studentId);
            if (student == null) return NotFound();
            if (payload.Username != null) student.Username = payload.Username;
            if (payload.Password != null)
            {
                student.Password = HashService.GetSha256Hash(payload.Password);
            }

            _context.Users.Update(student);
            await _context.SaveChangesAsync();

            return Ok(student);
        }

        [HttpPut("unenroll")]
        [Authorize(Policy = "StudentOrAdmin")]
        public async Task<IActionResult> UnEnroll(int studentId, int courseId)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            var student = await _context.Students.FirstOrDefaultAsync((s => s.UserId == studentId && s.CourseId == courseId));
            if (student == null) return NotFound();
        
            student.CourseId = null;
            _context.Students.Update(student);
            await _context.SaveChangesAsync();

            return Ok(student);
        }
    }
}
