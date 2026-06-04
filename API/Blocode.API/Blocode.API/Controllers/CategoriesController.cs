using Blocode.API.Data;
using Blocode.API.Models.Domain;
using Blocode.API.Models.DTO;
using Blocode.API.Repositories.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Blocode.API.Controllers
{
    // https://localhost:xxxx/api/categories
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryRepository categoryRepository;

        public CategoriesController(ICategoryRepository categoryRepository)
        {
            this.categoryRepository = categoryRepository;
        }

        [HttpPost]
        public async Task<IActionResult> CreateCategory(CreateCategoryRequestDTO request)
        {
            var newCategory = new Category()    
            {
                Name = request.Name,
                UrlHandle = request.UrlHandle
            };
            await categoryRepository.CreateCategoryAsync(newCategory);
            var response = new CategoryDTO()
            {
                Id = newCategory.Id,
                Name = newCategory.Name,
                UrlHandle = newCategory.UrlHandle
            };
            return Ok(response);
        }

        /* GET =>  https://localhost:7143/api/Categories */
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            var categoriesFromDb = await categoryRepository.GetAllCategoriesAsync();
            var response = new List<CategoryDTO>();
            foreach (var category in categoriesFromDb)
            {
                response.Add(new CategoryDTO() { Id = category.Id, Name = category.Name, UrlHandle = category.UrlHandle });
            }
            return Ok(response);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<Category?>> GetCategoryById([FromRoute] Guid id)
        {
            var foundedCategory = await categoryRepository.GetCategoryAsync(id);
            if (foundedCategory == null)
            {
                return NotFound($"Category with id {id} not found!");
            }
            else
            {
                var response = new CategoryDTO() { Id = id, Name = foundedCategory.Name, UrlHandle = foundedCategory.UrlHandle };
                return Ok(response);
            }
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<Category>> UpdateCategory([FromRoute] Guid id,[FromBody] UpdateCategoryRequestDTO updatedCategory)
        {
            var updatingCategory = new Category()
            {
                Id = id,
                Name = updatedCategory.Name,
                UrlHandle = updatedCategory.UrlHandle,
            };
            var result = await categoryRepository.UpdateCategoryByIdAsync(updatingCategory);
            if(result == null)
            {
                return NotFound($"Category With id {id} not found!");
            }
            else
            {
                var updateResultPayload = new CategoryDTO()
                {
                    Id = result.Id,
                    Name = result.Name,
                    UrlHandle = result.UrlHandle,
                };
                return Ok(updateResultPayload);
            }
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteCategoryById([FromRoute] Guid id)
        {
            var result = await categoryRepository.DeleteCategoryByIdAsync(id);
            if(result != null)
            {
                var response = new CategoryDTO()
                {
                    Id = result.Id,
                    Name = result.Name,
                    UrlHandle = result.UrlHandle 
                };
                return Ok(response);
            }
            else
            {
                return NotFound($"Category with id {id} not found!");
            }
        }
    }
}
