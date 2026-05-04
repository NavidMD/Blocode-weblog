using Blocode.API.Models.Domain;
using Blocode.API.Models.DTO;
using Blocode.API.Repositories.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Blocode.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogsController : ControllerBase
    {
        private readonly IBlogRepository blogRepository;

        public BlogsController(IBlogRepository blogRepository)
        {
            this.blogRepository = blogRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BlogPost>>> GetBlogs()
        {
            var response = await blogRepository.GetBlogsAsync();
            var mappedResponse = new List<BlogPostDTO>();
            foreach (var blog in response)
            {
                var item = new BlogPostDTO()
                {
                    Id = blog.Id,
                    Title = blog.Title,
                    ShortDescription = blog.ShortDescription,
                    Content = blog.Content,
                    UrlHandle = blog.UrlHandle,
                    FeaturedImageUrl = blog.FeaturedImageUrl,
                    PublishedDate = blog.PublishedDate,
                    Author = blog.Author,
                    IsVisible = blog.IsVisible
                };
                mappedResponse.Add(item);
            }
            return Ok(mappedResponse);
        }

        [HttpPost]
        public async Task<ActionResult<BlogPost>> CreateBlog(CreateBlogRequestDTO newBlogRequest)
        {
            var newBlog = new BlogPost()
            {
                Title = newBlogRequest.Title,
                ShortDescription = newBlogRequest.ShortDescription,
                Content = newBlogRequest.Content,
                FeaturedImageUrl = newBlogRequest.FeaturedImageUrl,
                PublishedDate = newBlogRequest.PublishedDate,
                Author = newBlogRequest.Author,
                UrlHandle = newBlogRequest.UrlHandle,
                IsVisible = newBlogRequest.IsVisible,
            };

            var result = await blogRepository.CreateBlogAsync(newBlog);
            if (result == null)
            {
                return BadRequest();
            }
            else
            {
                var response = new BlogPostDTO()
                {
                    Id = result.Id,
                    Title = result.Title,
                    ShortDescription = result.ShortDescription,
                    Content = result.Content,
                    FeaturedImageUrl = result.FeaturedImageUrl,
                    PublishedDate = result.PublishedDate,
                    Author = result.Author,
                    UrlHandle = result.UrlHandle,
                    IsVisible = result.IsVisible,
                };
                return Ok(response);
            }
        }
    }
}
