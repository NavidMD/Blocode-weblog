using Blocode.API.Models.Domain;

namespace Blocode.API.Repositories.Interface
{
    public interface ICategoryRepository
    {
        Task<Category> CreateCategoryAsync(Category category);
    }
}
