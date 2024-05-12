using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolSystemAPI.Factories;
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

        public StudentsController(DataContext context, IStudentAbstractFactory studentFactory)
        {
            _context = context;
            _studentFactory = studentFactory;
        }

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllStudents()
        {
            var students = await _context.Students.ToListAsync();
            if (students == null) return NotFound("Students not found!");

            var result = new List<object>();

            foreach (var student in students)
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
            var student = await _context.Students.FirstOrDefaultAsync(s => s.Id == studentId);
            if (student == null) return NotFound("Student with the given id Not Found!");

            var course = await _context.Courses.FirstOrDefaultAsync(c => c.Id == courseId);
            if (course == null) return NotFound("Course with the given id Not Found!");

            // Provera da li je student već prijavljen na kurs
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
