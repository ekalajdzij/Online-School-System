using System.Runtime.CompilerServices;
using System.Security.Cryptography;
using System.Text;

namespace SchoolSystemAPI.Services
{
    public class HashService
    {
        private const string ValidChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

        /*public static string GenerateRandomSecretKey()
        {
            var random = new Random();
            var secretKey = new char[20];

            for (int i = 0; i < secretKey.Length; i++) secretKey[i] = ValidChars[random.Next(ValidChars.Length)];

            return new string(secretKey);
        }*/

        public static string GetSha256Hash(string input)
        {
            using (var sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(input));

                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }
    }
}
