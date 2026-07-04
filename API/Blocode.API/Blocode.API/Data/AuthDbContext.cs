using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Blocode.API.Data
{
    public class AuthDbContext : IdentityDbContext
    {
        public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // create reader and writer role
            var readerRoleId = "8fa65cdd-f324-4b96-8bd0-23a240ebadef";
            var writerRoleId = "d7387f3c-bc85-4886-b8c2-cdd58b3dd1f0";
            var roles = new List<IdentityRole>
            {
                new IdentityRole()
                {
                    Id = readerRoleId,
                     Name = "Reader",
                     NormalizedName = "READER",
                     ConcurrencyStamp = readerRoleId
                },
                new IdentityRole()
                {
                    Id = writerRoleId,
                    Name = "Writer",
                    NormalizedName = "WRITER",
                    ConcurrencyStamp = writerRoleId
                }
            };

            // seed roles
            builder.Entity<IdentityRole>().HasData(roles);

            // create sample admin user for default
            var adminUserId = "0f8cda08-b3e7-499a-a42b-14f6e5cb5ef0";
            var admin = new IdentityUser
            {
                Id = adminUserId,
                UserName = "admin@blocode.com",
                Email = "admin@blocode.com",
                NormalizedEmail = "ADMIN@BLOCODE.COM",
                NormalizedUserName = "ADMIN@BLOCODE.COM",
                PasswordHash = "AQAAAAIAAYagAAAAEGBfKiOIloGuSQxUVKkVDM5VRN0EP/hF4DMmdnbbV4zntFY1rux/U6OhsZeKfsOb5A==",
                SecurityStamp = adminUserId,
                ConcurrencyStamp = adminUserId
            };
            //admin.PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(admin, "Admin@1234");

            // seed default admin 
            builder.Entity<IdentityUser>().HasData(admin);

            // give roles to default admin
            var adminRoles = new List<IdentityUserRole<string>>()
            {
                new IdentityUserRole<string>()
                {
                    UserId = adminUserId,
                    RoleId = writerRoleId
                },
                new IdentityUserRole<string>()
                {
                    UserId = adminUserId,
                    RoleId = readerRoleId
                }
            };

            builder.Entity<IdentityUserRole<string>>().HasData(adminRoles);
        }
    }
}
