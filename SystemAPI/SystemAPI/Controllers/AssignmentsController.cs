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
    public class AssignmentsController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;

        public AssignmentsController(DataContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpGet("all")]
        [Authorize(Policy = "ProfessorOrAssistantOrStudentOrAdmin")]
        public async Task<IActionResult> GetAllAssignments()
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key); 

            var assignments = await _context.Assignments
                .GroupBy(a => new {a.CourseId, a.Name, a.FileAssignment, a.Deadline })
                .Select(g => new
                {
                    Id = g.First().Id,
                    ProfessorIds = g.Select(a => a.ProfessorId).Distinct().ToList(),
                    AssistantIds = g.Select(a => a.AssistantId).Distinct().ToList(),
                    CourseId = g.Key.CourseId,
                    Name = g.Key.Name,
                    FileAssignment = g.Key.FileAssignment,
                    Deadline = g.Key.Deadline
                }).ToListAsync();

            return Ok(assignments);
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "ProfessorOrAssistantOrStudentOrAdmin")]
        public async Task<IActionResult> GetAssignmentById(int id)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            var assignment = await _context.Assignments.FirstOrDefaultAsync(a => a.Id == id);
            if (assignment == null) return NotFound();

            return Ok(assignment);
        }

        [HttpPost("assignment")]
        [Authorize(Policy = "ProfessorOrAssistantOrAdmin")]
        public async Task<IActionResult> CreateAssignment(AssignmentRequest assignment)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            if (!ModelState.IsValid) return BadRequest("Invalid model state!");

            var assignments = new List<Assignment>();

            foreach (var professorId in assignment.ProfessorId)
            {
                if (assignment.AssistantId == null || !assignment.AssistantId.Any())
                {
                    var newAssignment = new Assignment
                    {
                        Name = assignment.Name,
                        FileAssignment = assignment.FileAssignment ?? null,
                        Deadline = assignment.Deadline ?? null,
                        ProfessorId = professorId,
                        CourseId = assignment.CourseId
                    };

                    assignments.Add(newAssignment);
                }
                else
                {
                    foreach (var assistantId in assignment.AssistantId)
                    {
                        var newAssignment = new Assignment
                        {
                            Name = assignment.Name,
                            FileAssignment = assignment.FileAssignment ?? null,
                            Deadline = assignment.Deadline ?? null,
                            ProfessorId = professorId,
                            AssistantId = assistantId,
                            CourseId = assignment.CourseId
                        };

                        assignments.Add(newAssignment);
                    }
                }
            }

            _context.Assignments.AddRange(assignments);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "ProfessorOrAssistantOrStudentOrAdmin")]
        public async Task<IActionResult> UpdateAssignment(int id, AssignmentUpdateRequest assignmentUpdate)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid model state!");
            }

            var assignment = await _context.Assignments.FirstOrDefaultAsync(a => a.Id == id);
            if (assignment == null)
            {
                return NotFound();
            }

            var assignmentsToUpdate = await _context.Assignments
                .Where(a => a.Name == assignment.Name)
                .ToListAsync();

            foreach (var assignmentToUpdate in assignmentsToUpdate)
            {
                assignmentToUpdate.Name = assignmentUpdate.Name ?? assignmentToUpdate.Name;
                assignmentToUpdate.FileAssignment = assignmentUpdate.File ?? assignmentToUpdate.FileAssignment;
                assignmentToUpdate.Deadline = assignmentUpdate.Deadline ?? assignmentToUpdate.Deadline;

                _context.Update(assignmentToUpdate);
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "ProfessorOrAssistantOrAdmin")]
        public async Task<IActionResult> DeleteAssignment(int id)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            var assignment = await _context.Assignments.FindAsync(id);
            if (assignment == null)
            {
                return NotFound();
            }

            var submissionsToDelete = await _context.Submissions
                .Where(s => s.AssignmentId == id)
                .ToListAsync();

            _context.Submissions.RemoveRange(submissionsToDelete);
            await _context.SaveChangesAsync();

            _context.Assignments.Remove(assignment);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("submissions/{id}")]
        [Authorize(Policy = "ProfessorOrAssistantOrAdmin")]
        public async Task<IActionResult> GetAssignmentSubmissions(int id)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key); 

            var submissions = await _context.Submissions
                .Where(s => s.AssignmentId == id)
                .ToListAsync();

            return Ok(submissions);
        }
    }

}
