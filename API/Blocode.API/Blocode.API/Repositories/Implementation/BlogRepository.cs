using Blocode.API.Data;
using Blocode.API.Models.Domain;
using Blocode.API.Repositories.Interface;

namespace Blocode.API.Repositories.Implementation
{
    public class BlogRepository : IBlogRepository
    {
        private readonly ApplicationDbContext _context;
        public BlogRepository(ApplicationDbContext database)
        {
            _context = database;
        }

        public async Task<BlogPost> CreateBlogAsync(BlogPost blogPost)
        {
            await _context.BlogPosts.AddAsync(blogPost);
            await _context.SaveChangesAsync();
            return blogPost;
        }
    }
}
