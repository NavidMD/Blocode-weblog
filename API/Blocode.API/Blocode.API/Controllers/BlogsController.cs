using Blocode.API.Models.Domain;
using Blocode.API.Models.DTO;
using Blocode.API.Repositories.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Blocode.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogsController : ControllerBase
    {
        private readonly IBlogRepository blogRepository;
        private readonly ICategoryRepository categoryRepository;

        public BlogsController(IBlogRepository blogRepository, ICategoryRepository categoryRepository)
        {
            this.blogRepository = blogRepository;
            this.categoryRepository = categoryRepository;
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
                    IsVisible = blog.IsVisible,
                    Categories = blog.Categories.Select(c => new CategoryDTO()
                    {
                        Id = c.Id,
                        Name = c.Name,
                        UrlHandle = c.UrlHandle
                    }).ToList()

                };
                mappedResponse.Add(item);
            }
            return Ok(mappedResponse);
        }

        [HttpPost]
        public async Task<ActionResult<BlogPost>> CreateBlog([FromBody] CreateBlogRequestDTO newBlogRequest)
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
                Categories = new List<Category>() { }
            };

            if (newBlogRequest.Categories.Length > 0)
            {
                foreach (var category in newBlogRequest.Categories)
                {
                    var categoryModelInDB = await categoryRepository.GetCategoryAsync(category);
                    if (categoryModelInDB != null)
                    {
                        newBlog.Categories.Add(categoryModelInDB);
                    }
                }

            }
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
                    Categories = result.Categories.Select(c => new CategoryDTO()
                    {
                        Id = c.Id,
                        Name = c.Name,
                        UrlHandle = c.UrlHandle
                    }).ToList()
                };
                return Ok(response);
            }
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<BlogPost?>> GetBlogById([FromRoute] Guid id)
        {

            var result = await blogRepository.GetBlogAsync(id);

            if (result == null)
            {
                return NotFound();
            }
            else
            {
                var responseDTO = new BlogPostDTO()
                {
                    Author = result.Author,
                    Id = result.Id,
                    Title = result.Title,
                    Content = result.Content,
                    FeaturedImageUrl = result.FeaturedImageUrl,
                    PublishedDate = result.PublishedDate,
                    UrlHandle = result.UrlHandle,
                    IsVisible = result.IsVisible,
                    ShortDescription = result.ShortDescription,
                    Categories = new List<CategoryDTO>()
                };
                foreach (var category in result.Categories)
                {
                    var categoryDTO = new CategoryDTO()
                    {
                        Id = category.Id,
                        Name = category.Name,
                        UrlHandle = category.UrlHandle,
                    };
                    responseDTO.Categories.Add(categoryDTO);
                }
                return Ok(responseDTO);
            }
        }
    }
}
