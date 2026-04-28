using System.ComponentModel.DataAnnotations;

namespace Blocode.API.Models.DTO
{
    public class UpdateCategoryRequestDTO
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string UrlHandle { get; set; }
    }
}
