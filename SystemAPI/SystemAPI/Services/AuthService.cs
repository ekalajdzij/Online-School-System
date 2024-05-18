using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Claims;
using SystemAPI.Models;

namespace SchoolSystemAPI.Services
{
    public static class AuthService
    {
        public static string GenerateJwtToken(User user, string issuer, string key)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username)
            };

            if (user.IsAdmin == true)
            {
                Console.WriteLine("Adding role claim for Admin");
                claims.Add(new Claim(ClaimTypes.Role, "Admin"));
            }
            if (user.IsProfessor == true)
                claims.Add(new Claim(ClaimTypes.Role, "Professor"));
            if (user.IsStudent == true)
                claims.Add(new Claim(ClaimTypes.Role, "Student"));
            if (user.IsAssistant == true)
                claims.Add(new Claim(ClaimTypes.Role, "Assistant"));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(60),
                SigningCredentials = credentials,
                Issuer = issuer,
                Audience = issuer
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            
            return tokenHandler.WriteToken(token);
        }

        public static void ExtendJwtTokenExpirationTime(HttpContext context, string issuer, string key)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (token != null)
            {
                var tokenValidationParams = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = issuer,
                    ValidateAudience = false,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key))
                };

                var tokenHandler = new JwtSecurityTokenHandler();
                var principal = tokenHandler.ValidateToken(token, tokenValidationParams, out var validatedToken);

                var expiryTime = validatedToken.ValidTo;

                if (expiryTime > DateTime.UtcNow)
                {
                    var jwtToken = validatedToken as JwtSecurityToken;
                    var newClaims = jwtToken.Claims.ToList();
                    var newToken = GenerateJwtTokenFromClaims(newClaims, issuer, key);
                    context.Response.Headers.Add("Authorization", "Bearer " + newToken);
                }
            }
        }

        private static string GenerateJwtTokenFromClaims(IEnumerable<Claim> claims, string issuer, string key)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(60),
                SigningCredentials = credentials,
                Issuer = issuer,
                Audience = issuer
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}