using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolSystemAPI.Dtos;
using SchoolSystemAPI.Services;
using SystemAPI.Data;
using SystemAPI.Models;

namespace SchoolSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;

        public CoursesController(DataContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }


        [HttpGet("all")]
        [Authorize(Policy = "ProfessorOrAssistantOrStudentOrAdmin")]
        public async Task<IActionResult> GetCourses()
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            var courses = await _context.Courses.ToListAsync();
     
            return Ok(courses);
        }


        [HttpGet("{id}")]
        [Authorize(Policy = "ProfessorOrAssistantOrStudentOrAdmin")]
        public async Task<IActionResult> GetCourse(int id)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            var course = await _context.Courses.FirstOrDefaultAsync(x => x.Id == id);
            if (course == null) return NotFound();
            
            return Ok(course);
        }


        [HttpPost("course")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> AddCourse(CourseUpdateRequest course)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var newCourse = new Course
            {
                Name = course.Name,
                Overview = course.Overview,
                Summary = course.Summary,
                ProfessorId = course.ProfessorId,
                AssistantId = course.AssistantId
            };
            _context.Courses.Add(newCourse);
            await _context.SaveChangesAsync();

            return Ok(newCourse);
        }


        [HttpPut("{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> UpdateCourse(int id, CourseUpdateRequest course)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            var existingCourse = await _context.Courses.FindAsync(id);
            if (existingCourse == null)
            {
                return NotFound();
            }

            if (course.Name != null) existingCourse.Name = course.Name;
            if (course.Overview != null) existingCourse.Overview = course.Overview;
            if (course.Summary != null) existingCourse.Summary = course.Summary;
            if (course.ProfessorId != null) existingCourse.ProfessorId = course.ProfessorId;
            if (course.AssistantId != null) existingCourse.AssistantId = course.AssistantId;

            _context.Courses.Update(existingCourse);
            await _context.SaveChangesAsync();

            return Ok(existingCourse);
        }


        [HttpDelete("{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            var course = await _context.Courses.FindAsync(id);
            if (course == null) return NotFound();

            var materials = _context.Materials.Where(m => m.CourseId == id).ToList();
            if (materials.Any())
            {
                _context.Materials.RemoveRange(materials);
                await _context.SaveChangesAsync();
            } 

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("student")]
        [Authorize(Policy = "ProfessorOrAssistantOrStudentOrAdmin")]
        public async Task<IActionResult> GetCoursesForStudent(int id)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            var student = await _context.Students
                .Where(s => s.UserId == id)
                .ToListAsync();
            if (student == null) return NotFound();
            var courses = new List<Course>();
            foreach (var s in student)
            {
                var courseId = s.CourseId;
                var course = await _context.Courses
                    .Where(c => c.Id == courseId)
                    .FirstOrDefaultAsync();
                if (course != null) courses.Add(course);
            }

            return Ok(courses);
        }

        [HttpGet("professor")]
        [Authorize(Policy = "ProfessorOrAssistantOrStudentOrAdmin")]
        public async Task<IActionResult> GetCoursesForProfessor(int professorId)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            var courses = await _context.Courses.
                Where(c => c.ProfessorId == professorId)
                .ToListAsync(); 
            if (courses == null) return NotFound();

            return Ok(courses);
        }

        [HttpGet("assistant")]
        [Authorize(Policy = "ProfessorOrAssistantOrStudentOrAdmin")]
        public async Task<IActionResult> GetCoursesForAssistant(int assistantId)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            var courses = await _context.Courses.
                Where(c => c.AssistantId == assistantId)
                .ToListAsync();
            if (courses == null) return NotFound();

            return Ok(courses);
        }
    }
}
