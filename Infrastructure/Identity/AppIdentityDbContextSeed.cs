using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUsersAsync(UserManager<AppUser> userManager){
            if(!userManager.Users.Any()){
                var user = new AppUser{
                    DisplayName = "Ajna",
                    Email = "ajna.cancar2019@size.ba",
                    UserName = "ajna.cancar",
                    Address = new Address{
                        FirstName = "Ajna",
                        LastName = "Cancar"
                    }
                     
                };

                await userManager.CreateAsync(user, "Pas$$w0rd");

            }
        }
    }
}