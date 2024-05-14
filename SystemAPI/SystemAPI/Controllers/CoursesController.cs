using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolSystemAPI.Dtos;
using SystemAPI.Data;
using SystemAPI.Models;

namespace SchoolSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        private readonly DataContext _context;

        public CoursesController(DataContext context)
        {
            _context = context;
        }


        [HttpGet("all")]
        public async Task<IActionResult> GetCourses()
        {
            var courses = await _context.Courses.ToListAsync();
            return Ok(courses);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetCourse(int id)
        {
            var course = await _context.Courses.FirstOrDefaultAsync(x => x.Id == id);
            return Ok(course);
        }


        [HttpPost("course")]
        public async Task<IActionResult> AddCourse(CourseUpdateRequest course)
        {
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

            return Ok(course);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCourse(int id, CourseUpdateRequest course)
        {
           
            var existingCourse = await _context.Courses.FindAsync(id);
            if (existingCourse == null)
            {
                return NotFound("Course not found.");
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
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
            {
                return NotFound("Course not found.");
            }

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return Ok($"Course with the id {id} deleted successfully!");
        }






    }
}
