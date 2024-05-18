using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolSystemAPI.Dtos;
using SystemAPI.Data;
using SchoolSystemAPI.Services;
using Azure.Security.KeyVault.Certificates;

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
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
            return Ok(user);
        }

        [HttpGet("admin")]
        public async Task<IActionResult> GetAdmin()
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.IsAdmin == true);
            return Ok(user);
        }


    }
}
