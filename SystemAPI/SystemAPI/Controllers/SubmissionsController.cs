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
    public class SubmissionsController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;

        public SubmissionsController(DataContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpGet("all")]
        [Authorize(Policy = "ProfessorOrAssistantOrStudentOrAdmin")]
        public async Task<IActionResult> GetAllSubmissions()
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            var submissions = await _context.Submissions.ToListAsync();
            return Ok(submissions);
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "ProfessorOrAssistantOrStudentOrAdmin")]
        public async Task<IActionResult> GetSubmissionById(int id)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            var submission = await _context.Submissions.FirstOrDefaultAsync(s => s.Id == id);
            if (submission == null) return NotFound("Submission not found!");
            return Ok(submission);
        }

        [HttpGet("student/{studentId}/{assignmentId}")]
        [Authorize(Policy = "ProfessorOrAssistantOrAdmin")]
        public async Task<IActionResult> GetSubmissionsByStudentForAssignment(int studentId, int assignmentId)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            var submissions = await _context.Submissions
                .Where(s => (s.StudentId == studentId && s.AssignmentId == assignmentId))
                .ToListAsync();
            return Ok(submissions);
        }

        [HttpPost("submission/student")]
        [Authorize(Policy = "StudentOrAdmin")]
        public async Task<IActionResult> CreateStudentSubmission(SubmissionRequest submission)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
             var key = _configuration.GetSection("Jwt:Key").Value;
             AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            if (!ModelState.IsValid) return BadRequest("Invalid model state!");

            var newSubmission = new Submission
            {
                StudentId = submission.StudentId,
                AssignmentId = submission.AssignmentId,
                FileSubmission = submission.FileSubmission ?? null
            };

            await _context.Submissions.AddAsync(newSubmission);
            await _context.SaveChangesAsync();

            return Ok("Submission created successfully!");
        }

        [HttpPut("student/{id}")]
        [Authorize(Policy = "StudentOrAdmin")]
        public async Task<IActionResult> UpdateSubmissionStudent(int id, SubmissionUpdateRequest payload)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            if (!ModelState.IsValid) return BadRequest("Invalid model state!");
            var submission = await _context.Submissions.FirstOrDefaultAsync(s => s.Id == id);
            if (submission == null) return NotFound("Submission not found!");

            submission.FileSubmission = payload.FileSubmission ?? submission.FileSubmission;

            _context.Update(submission);
            await _context.SaveChangesAsync();

            return Ok("Submission updated successfully!");
        }

        [HttpPut("ansamble/{id}")]
        [Authorize(Policy = "ProfessorOrAssistantOrAdmin")]
        public async Task<IActionResult> UpdateSubmissionAnsamble(int id, SubmissionUpdateRequest payload)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            if (!ModelState.IsValid) return BadRequest("Invalid model state!");
            var submission = await _context.Submissions.FirstOrDefaultAsync(s => s.Id == id);
            if (submission == null) return NotFound("Submission not found!");

            submission.Grade = payload.Grade ?? submission.Grade;
            submission.Comment = payload.Comment ?? submission.Comment;
            _context.SaveChanges();

            _context.Update(submission);
            await _context.SaveChangesAsync();

            return Ok("Submission updated successfully!");
        }

        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteSubmission(int id)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            var submission = await _context.Submissions.FindAsync(id);
            if (submission == null) return NotFound("Submission not found!");

            _context.Submissions.Remove(submission);
            await _context.SaveChangesAsync();

            return Ok("Submission deleted successfully!");
        }
    }
}
