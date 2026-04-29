using Blocode.API.Models.Domain;
using Microsoft.AspNetCore.Mvc;

namespace Blocode.API.Repositories.Interface
{
    public interface ICategoryRepository
    {
        Task<Category> CreateCategoryAsync(Category category);

        Task<IEnumerable<Category>> GetAllCategoriesAsync();

        Task<Category?> GetCategoryAsync(Guid id);

        Task<Category?> UpdateCategoryByIdAsync(Category updatedCategory);

        Task<Category?> DeleteCategoryByIdAsync(Guid id);
    }
}
