using Blocode.API.Data;
using Blocode.API.Models.Domain;
using Blocode.API.Repositories.Interface;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

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

        public async Task<BlogPost?> GetBlogAsync(Guid id)
        {
            return await _context.BlogPosts.Include(b => b.Categories).FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<IEnumerable<BlogPost>> GetBlogsAsync()
        {
            return await _context.BlogPosts.Include(b => b.Categories).ToListAsync(); 
        }

        public async Task<BlogPost?> UpdateBlogAsync(BlogPost newblogPost)
        {
            var existingBlog = await _context.BlogPosts.Include(b => b.Categories).FirstOrDefaultAsync(b => b.Id == newblogPost.Id);
            if (existingBlog == null)
            {
                return null;
            }
            _context.BlogPosts.Entry(existingBlog).CurrentValues.SetValues(newblogPost);
            existingBlog.Categories = newblogPost.Categories;
            _context.SaveChanges();
            return newblogPost;
        }
    }
}
