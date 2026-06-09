using Blocode.API.Models.Domain;
using Blocode.API.Models.DTO;
using Blocode.API.Repositories.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Blocode.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        private readonly IImageRepository imageRepository;

        public ImagesController(IImageRepository imageRepository)
        {
            this.imageRepository = imageRepository;
        }
       
        // Post: {apibaseurl}/api/images
        [HttpPost]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile file, [FromForm] string fileName, [FromForm] string title )
        {
            ValidateFileUpload(file);
            if(ModelState.IsValid)
            {
                var blogImage = new BlogImage()
                {
                    FileExtension = Path.GetExtension(file.FileName).ToLower(),
                    Title = title,
                    FileName = fileName,
                    DateCreated = DateTime.Now,
                };

                blogImage = await imageRepository.Upload(file, blogImage);

                //converting to DTO
                var response = new BlogImageDTO
                {
                    Id = blogImage.Id,
                    Title = blogImage.Title,
                    FileName = blogImage.FileName,
                    DateCreated = blogImage.DateCreated,
                    FileExtension = blogImage.FileExtension,
                    Url = blogImage.Url,
                };

                return Ok(response);
            }
            return BadRequest(ModelState);
        }

        private void ValidateFileUpload(IFormFile file)
        {
            var allowedExtensions = new string[] { ".jpg", ".jpeg", ".png" };
            if (!allowedExtensions.Contains(Path.GetExtension(file.FileName).ToLower()))
            {
                ModelState.AddModelError("File", "Unsupported file format!");
            }
            if (file.Length > 10485760)
            {
                ModelState.AddModelError("File", "File size cannot be more than 10MB!");
            }
        }
    }
}
