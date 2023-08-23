using System.ComponentModel.DataAnnotations;

namespace dotnetapi_api.Models
{
    public class User
    {
        [Key]
        public int Record_ID { get; set; }
        public int HN { get; set; }
        public string Name { get; set; }
        public string Lastname { get; set; }
        public string Contact_Tel { get; set; }
        public string Contact_Email { get; set; }

    }
}
