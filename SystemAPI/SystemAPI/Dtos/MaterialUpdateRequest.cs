using System.ComponentModel.DataAnnotations;
using System.Globalization;

namespace SchoolSystemAPI.Dtos
{
    public class MaterialUpdateRequest
    {
        [Required]
        public string Name { get; set; }
        public int? CourseId { get; set; }
    }
}
