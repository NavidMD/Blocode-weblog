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
            //Map requestDTO to Model 
            var newCategory = new Category()
            {
                Name = request.Name,
                UrlHandle = request.UrlHandle
            };
            //Sending to CategoryRepository
            await categoryRepository.CreateCategoryAsync(newCategory);

            //Map Model to responseDTO
            var response = new CategoryDTO()
            {
                Id = newCategory.Id,
                Name = newCategory.Name,
                UrlHandle = newCategory.UrlHandle
            };

            return Ok(response);
        }
    }
}
