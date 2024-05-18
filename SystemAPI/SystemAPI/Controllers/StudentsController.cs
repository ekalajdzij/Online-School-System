using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Configuration;
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
        public async Task<ActionResult<IEnumerable<object>>> GetAllStudents()
        {
            /*var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);*/

            var students = await _context.Students.ToListAsync();
            if (students == null) return NotFound("Students not found!");

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
            if (result.Count == 0) return NotFound("Students not found!");
            else return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<object>>> GetStudent(int id)
        {
            /*var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);*/

            var student = await _context.Students.FirstOrDefaultAsync(s => s.Id == id);
            if (student == null) return NotFound("Student with the given id Not Found!");

            var user = await _context.Users.FindAsync(student.UserId);
            if (user == null) return NotFound("Student with the given id Not Found!");

            var obj = _studentFactory.CreateStudent(user, student);
            return Ok(obj);
        }

        [HttpPut("enroll")]
        public async Task<ActionResult> EnrollStudent(int studentId, int courseId)
        {
            /*var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);*/

            var student = await _context.Students.FirstOrDefaultAsync(s => s.Id == studentId);
            if (student == null) return NotFound("Student with the given id Not Found!");

            var course = await _context.Courses.FirstOrDefaultAsync(c => c.Id == courseId);
            if (course == null) return NotFound("Course with the given id Not Found!");

            if (student.CourseId == courseId)
            {
                return Conflict("Student is already enrolled in the course!");
            }
            var studentTemp = new Student();
            studentTemp.StudyYear = student.StudyYear;
            studentTemp.UserId = student.UserId;
            studentTemp.CourseId = courseId;
            _context.Add(studentTemp);
            _context.SaveChanges();

            return Ok("Student enrolled in course successfully!");
        }



    }
}
