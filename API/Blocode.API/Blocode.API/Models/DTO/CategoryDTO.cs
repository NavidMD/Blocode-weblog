using Blocode.API.Models.Domain;

namespace Blocode.API.Models.DTO
{
    public class CategoryDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string UrlHandle { get; set; }
        public Guid? ParentCategoryId { get; set; }
        public List<CategoryDTO>? SubCategories { get; set; }
    }
}
