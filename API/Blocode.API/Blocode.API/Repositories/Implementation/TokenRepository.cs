using Blocode.API.Repositories.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Blocode.API.Repositories.Implementation
{
    public class TokenRepository : ITokenRepository
    {
        private readonly IConfiguration configuration;

        public TokenRepository(IConfiguration configuration)
        {
            this.configuration = configuration;
        }
        public string CreateJwtToken(IdentityUser user, List<string> roles)
        {
            // create claims
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email)
            };
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
            // jwt security token parameters
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            // create jwt token
            var token = new JwtSecurityToken(
                    audience: configuration["Jwt:Audience"],
                    issuer: configuration["Jwt:Issuer"],
                    claims: claims,
                    signingCredentials: credentials,
                    expires: DateTime.Now.AddMinutes(60)
               );
            // return token
            return new JwtSecurityTokenHandler().WriteToken(token); 
        }
    }
}
