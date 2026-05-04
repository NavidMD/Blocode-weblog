using Blocode.API.Models.Domain;

namespace Blocode.API.Repositories.Interface
{
    public interface IBlogRepository
    {
        Task<BlogPost> CreateBlogAsync(BlogPost blogPost);

        Task<IEnumerable<BlogPost>> GetBlogsAsync();
    }
}
