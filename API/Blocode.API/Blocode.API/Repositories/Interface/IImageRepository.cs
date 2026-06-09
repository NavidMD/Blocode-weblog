using Blocode.API.Models.Domain;

namespace Blocode.API.Repositories.Interface
{
    public interface IImageRepository
    {
        Task<BlogImage> Upload(IFormFile file, BlogImage blogImage);
    }
}
