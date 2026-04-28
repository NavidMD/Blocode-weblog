using Blocode.API.Models.Domain;

namespace Blocode.API.Repositories.Interface
{
    public interface ICategoryRepository
    {
        Task<Category> CreateCategoryAsync(Category category);

        Task<IEnumerable<Category>> GetAllCategoriesAsync();

        Task<Category?> GetCategoryAsync(Guid id);

        Task<Category?> UpdateCategoryByIdAsync(Category updatedCategory);
    }
}
