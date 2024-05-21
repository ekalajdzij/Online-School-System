using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolSystemAPI.Services;
using SystemAPI.Data;
using SystemAPI.Models;

namespace SchoolSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadsController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<BlobStorageService> _logger;

        public UploadsController(DataContext context, IConfiguration configuration, ILogger<BlobStorageService> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("upload")]
        [Authorize(Policy = "ProfessorOrAssistantOrStudentOrAdmin")]
        public async Task<IActionResult> UploadFile(IFormFile file, int userId, int assignmentId)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            if (file == null || file.Length == 0)
            {
                return BadRequest("File not found!");
            }

            var blobStorage = BlobStorageService.GetInstance(_configuration, _logger);
            string urlString;

            using (var stream = file.OpenReadStream())
            {
                urlString = await blobStorage.UploadFileToBlobAsync(file.FileName, file.ContentType, stream);
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found!");
            }

            if (user.IsProfessor == true)
            {
                var originalAssignment = await _context.Assignments.FindAsync(assignmentId);
                if (originalAssignment == null)
                {
                    return NotFound("Assignment not found!");
                }

                var assignmentsWithSameName = await _context.Assignments
                    .Where(a => a.Name == originalAssignment.Name && a.ProfessorId == userId)
                    .ToListAsync();

                foreach (var assignment in assignmentsWithSameName)
                {
                    assignment.FileAssignment = urlString;
                }

                _context.Assignments.UpdateRange(assignmentsWithSameName);
            }
            else if (user.IsAssistant == true)
            {
                var assignment = await _context.Assignments.FindAsync(assignmentId);
                if (assignment == null)
                {
                    return NotFound("Assignment not found!");
                }

                assignment.FileAssignment = urlString;
                _context.Assignments.Update(assignment);
            }
            else if (user.IsStudent == true)
            {
                var existingSubmission = await _context.Submissions
                    .FirstOrDefaultAsync(s => s.StudentId == user.Id && s.AssignmentId == assignmentId);

                if (existingSubmission != null)
                {
                    existingSubmission.FileSubmission = urlString;
                    _context.Submissions.Update(existingSubmission);
                }
                else
                {
                    var newSubmission = new Submission
                    {
                        StudentId = user.Id,
                        AssignmentId = assignmentId,
                        FileSubmission = urlString
                    };
                    _context.Submissions.Add(newSubmission);
                }
            }
            else
            {
                return BadRequest("Unknown user role!");
            }

            await _context.SaveChangesAsync();

            return Ok("File is uploaded!");
        }

    }
}
