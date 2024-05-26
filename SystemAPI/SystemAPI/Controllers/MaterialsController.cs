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
    public class MaterialsController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;

        public MaterialsController(DataContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpGet("all")]
        [Authorize(Policy = "ProfessorOrAssistantOrStudentOrAdmin")]
        public async Task<IActionResult> GetMaterials()
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            var courses = await _context.Materials.ToListAsync();

            return Ok(courses);
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "ProfessorOrAssistantOrStudentOrAdmin")]
        public async Task<IActionResult> GetMaterial(int id)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            var material = await _context.Materials.FirstOrDefaultAsync(m => m.Id == id);
            if (material == null) return NotFound();

            return Ok(material);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "ProfessorOrAssistantOrAdmin")]
        public async Task<IActionResult> UpdateMaterial(int id, MaterialUpdateRequest material)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            var existingMaterial = await _context.Materials.FirstOrDefaultAsync(m => m.Id == id);
            if (existingMaterial == null) return NotFound();

            existingMaterial.Name = material.Name;
            _context.Materials.Update(existingMaterial);
            await _context.SaveChangesAsync();
            return Ok(existingMaterial);
        }

        [HttpPost("material")]
        [Authorize(Policy = "ProfessorOrAssistantOrAdmin")]
        public async Task<IActionResult> AddMaterial(MaterialUpdateRequest material)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var newMaterial = new Material
            {
                Name = material.Name,
                CourseId = material.CourseId ?? null
            };
            _context.Materials.Add(newMaterial);
            await _context.SaveChangesAsync();
            return Ok(newMaterial);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "ProfessorOrAssistantOrAdmin")]
        public async Task<IActionResult> DeleteMaterial(int id)
        {
            var issuer = _configuration.GetSection("Jwt:Issuer").Value;
            var key = _configuration.GetSection("Jwt:Key").Value;
            AuthService.ExtendJwtTokenExpirationTime(HttpContext, issuer, key);

            var material = await _context.Materials.FindAsync(id);
            if (material == null) return NotFound();

            _context.Materials.Remove(material);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
