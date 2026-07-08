using Blocode.API.Models.DTO;
using Blocode.API.Repositories.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Blocode.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> userManager;
        private readonly ITokenRepository tokenRepository;

        public AuthController(UserManager<IdentityUser> userManager, ITokenRepository tokenRepository)
        {
            this.userManager = userManager;
            this.tokenRepository = tokenRepository;
        }

        // POST : {apibaseurl}/api/auth/login
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO request)
        {
            var foundedUser = await userManager.FindByEmailAsync(request.Email);
            if (foundedUser != null)
            {
                var passwordIsValid = await userManager.CheckPasswordAsync(foundedUser, request.Password);
                if (passwordIsValid)
                {
                    var userRoles = await userManager.GetRolesAsync(foundedUser);
                    // creating jwt token
                    var jwtToken = tokenRepository.CreateJwtToken(foundedUser, userRoles.ToList());
                    var response = new LoginResponseDTO()
                    {
                        Email = request.Email,
                        Roles = userRoles.ToList(),
                    };

                    // appending jwt to cookie and sending cookie instead of jwt
                    Response.Cookies.Append("access_token", jwtToken, new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true,
                        SameSite = SameSiteMode.Lax,
                        Expires = DateTime.UtcNow.AddMinutes(20)
                    });
                    return Ok(response);
                }
                else
                {
                    ModelState.AddModelError("message", "کلمه عبور اشتباه است!");
                }
            }
            else
            {
                ModelState.AddModelError("message", "کاربری با این ایمیل یافت نشد!");
            }
            return ValidationProblem(ModelState);
        }

        // POST : {apibaseurl}/api/auth/register
        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO request)
        {
            // create identity user object
            var user = new IdentityUser
            {
                UserName = request.Email?.Trim(),
                Email = request.Email?.Trim(),
            };
            // create user
            var identityResult = await userManager.CreateAsync(user, request.Password);
            if (identityResult.Succeeded) {
                // giving role to created user (reader)
                identityResult = await userManager.AddToRoleAsync(user, "Reader");
                if (identityResult.Succeeded)
                {
                    return Ok();
                }
                else
                {
                    if (identityResult.Errors.Any())
                    {
                        foreach (var error in identityResult.Errors)
                        {
                            ModelState.AddModelError("Error Occured!", error.Description);
                        }
                    }
                }
            }
            else
            {
                if (identityResult.Errors.Any())
                {
                    foreach (var error in identityResult.Errors)
                    {
                        ModelState.AddModelError("Error Occured!", error.Description);
                    }
                }
            }
            return ValidationProblem(ModelState);
        }

        // GET : {apibaseurl}/api/auth/me
        [Authorize]
        [HttpGet]
        [Route("me")]
        public IActionResult UserDetails()
        {
            if (User.Identity == null || !User.Identity.IsAuthenticated)
            {
                return Unauthorized();
            }
            var response = new LoginResponseDTO
            {
                Email = User.FindFirst(ClaimTypes.Email)?.Value,
                Roles = User.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList()
            };

            return Ok(response);
        }
    } 
}
