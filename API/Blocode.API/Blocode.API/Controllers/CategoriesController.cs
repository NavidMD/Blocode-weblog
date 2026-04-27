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
            //تبدیل اطلاعات درخواست به مدل دیتابیس
            var newCategory = new Category()    
            {
                Name = request.Name,
                UrlHandle = request.UrlHandle
            };
            // ارسال نمونه ساخته شده از مدل به ریپازیتوری برای افزودن به دیتابیس
            await categoryRepository.CreateCategoryAsync(newCategory);
            // DTO تبدیل مدل ساخته شده به
            var response = new CategoryDTO()
            {
                Id = newCategory.Id,
                Name = newCategory.Name,
                UrlHandle = newCategory.UrlHandle
            };
            //ارسال پاسخ به فرانت
            return Ok(response);
        }

        /* GET =>  https://localhost:7143/api/Categories */
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            //گرفتن دسته بندی ها از دیتابیس از طریق ریپازیتوری
            var categoriesFromDb = await categoryRepository.GetAllCategoriesAsync();
            //  DTO مپ کردن دسته بندی های دیتابیس به
            var response = new List<CategoryDTO>();
            foreach (var category in categoriesFromDb)
            {
                response.Add(new CategoryDTO() { Id = category.Id, Name = category.Name, UrlHandle = category.UrlHandle });
            }
            //ارسال پاسخ به فرانت
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
    }
}
