using System.ComponentModel.DataAnnotations;

namespace Blocode.API.Models.DTO
{
    public class CreateCategoryRequestDTO
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string UrlHandle { get; set; }
        public Guid? ParentCategoryId { get; set; }
    }
}
