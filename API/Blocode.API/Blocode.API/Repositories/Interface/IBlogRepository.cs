using Blocode.API.Models.Domain;

namespace Blocode.API.Repositories.Interface
{
    public interface IBlogRepository
    {
        Task<BlogPost> CreateBlogAsync(BlogPost blogPost);

        Task<IEnumerable<BlogPost>> GetBlogsAsync();

        Task<BlogPost?> GetBlogAsync(Guid id);

        Task<BlogPost?> UpdateBlogAsync(BlogPost blogPost);

        Task<BlogPost?> DeleteBlogAsync(Guid id);

        Task<IEnumerable<BlogPost>> GetBlogsByCategoryAsync(string categoryName);

        Task<BlogPost?> GetBlogByUrlHandleAsync(string urlHandle);

        Task<IEnumerable<BlogPost>> GetBlogsBySearchWordAndCategoryAsync(string? searchWord, string? categoryName);
    }
}
