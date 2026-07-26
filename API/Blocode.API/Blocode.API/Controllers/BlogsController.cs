using Azure;
using Blocode.API.Models.Domain;
using Blocode.API.Models.DTO;
using Blocode.API.Repositories.Interface;
using Microsoft.AspNetCore.Authorization;
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

        // GET : {apibaseurl}/api/blogs
        [HttpGet]
        public async Task<ActionResult> GetBlogs()
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

        // POST : {apibaseurl}/api/blogs
        [HttpPost]
        [Authorize(Roles = "Writer")]
        public async Task<ActionResult> CreateBlog([FromBody] CreateBlogRequestDTO newBlogRequest)
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

        // GET : {apibaseurl}/api/blogs/byCategory/{categoryName}
        [HttpGet("byCategory/{categoryName}")]
        public async Task<ActionResult> GetBlogsByCategory([FromRoute] string categoryName)
        {
            var result = await blogRepository.GetBlogsByCategoryAsync(categoryName);
            if (result == null || !result.Any())
            {
                return Ok(result);
            }
            var mappedResponse = new List<BlogPostDTO>();
            foreach (var blog in result)
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
            };
            return Ok(mappedResponse);
        }

        // GET : {apibaseurl}/api/blogs/{id}
        [HttpGet("{id:guid}")]
        public async Task<ActionResult> GetBlogById([FromRoute] Guid id)
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

        // GET : {apibaseurl}/api/blogs/{urlHandle}
        [HttpGet("{urlHandle}")]
        public async Task<ActionResult> GetBlogByUrlHandle([FromRoute] string urlHandle)
        {
            var result = await blogRepository.GetBlogByUrlHandleAsync(urlHandle);
            if(result == null) { 
                return NotFound(); 
            }
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

        // GET : {apibaseurl}/api/blogs/searchByWordAndCategory
        [HttpGet("searchByWordAndCategory")]
        public async Task<ActionResult> GetBlogsBySearchWordAndCategory([FromQuery] string? searchWord, [FromQuery] string? selectedCategory)
        {
            var result = await blogRepository.GetBlogsBySearchWordAndCategoryAsync(searchWord, selectedCategory);
            
            var mappedResponse = new List<BlogPostDTO>();
            foreach (var blog in result)
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
            };
            return Ok(mappedResponse);
        }
        // PUT : {apibaseurl}/api/blogs/{id}
        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Writer")]
        public async Task<ActionResult> UpdateBlogAsync([FromRoute] Guid id, [FromBody] UpdateBlogPostRequestDTO request)
        {
            var updatedBlog = new BlogPost()
            {
                Id = id,
                Title = request.Title,
                ShortDescription = request.ShortDescription,
                Content = request.Content,
                FeaturedImageUrl = request.FeaturedImageUrl,
                PublishedDate = request.PublishedDate,
                Author = request.Author,
                UrlHandle = request.UrlHandle,
                IsVisible = request.IsVisible,
                Categories = new List<Category>() { }
            };
            foreach (var category in request.Categories)
            {
                var existOrNot = await categoryRepository.GetCategoryAsync(category);
                if (existOrNot == null)
                {
                    return BadRequest("one or more categories selected are not available!");
                }
                if (existOrNot != null)
                {
                    updatedBlog.Categories.Add(existOrNot);
                }
            }
            var response = await blogRepository.UpdateBlogAsync(updatedBlog);
            if (response == null) {
                return BadRequest("error occured while updating blogpost");
            }
            var responseDto = new BlogPostDTO
            {
                Id = id,
                Title = updatedBlog.Title,
                ShortDescription = updatedBlog.ShortDescription,
                Content = updatedBlog.Content,
                FeaturedImageUrl = updatedBlog.FeaturedImageUrl,
                PublishedDate = updatedBlog.PublishedDate,
                Author = updatedBlog.Author,
                UrlHandle = updatedBlog.UrlHandle,
                IsVisible = updatedBlog.IsVisible,
                Categories = updatedBlog.Categories.Select(c => new CategoryDTO()
                {
                    Id = c.Id,
                    Name = c.Name,
                    UrlHandle = c.UrlHandle
                }).ToList()
            };
            return Ok(responseDto);
        }

        // DELETE : {apibaseurl}/api/blogs/{id}
        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Writer")]
        public async Task<ActionResult> DeleteBlogAsync([FromRoute] Guid id)
        {
            var deletedBlog = await blogRepository.DeleteBlogAsync(id);
            if (deletedBlog == null)
            {
                return NotFound("blog not found!");
            }
            var response = new BlogPostDTO()
            {
                Id = deletedBlog.Id,
                Title = deletedBlog.Title,
                ShortDescription = deletedBlog.ShortDescription,
                Content = deletedBlog.Content,
                FeaturedImageUrl = deletedBlog.FeaturedImageUrl,
                PublishedDate = deletedBlog.PublishedDate,
                Author = deletedBlog.Author,
                UrlHandle = deletedBlog.UrlHandle,
                IsVisible = deletedBlog.IsVisible,
            };
            return Ok(response);
        }
    }
}
