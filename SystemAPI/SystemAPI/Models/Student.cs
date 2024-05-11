using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SystemAPI.Models
{
    public class Student
    {
        [Key]
        public int Id { get; set; }
        public int StudyYear { get; set; }

        [ForeignKey("Course")]
        public int? CourseId { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
    }
}
