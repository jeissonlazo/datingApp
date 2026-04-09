using System;
using System.Security.Cryptography;
using System.Text.Json;
using API.Entities;
using Microsoft.EntityFrameworkCore;
namespace API.Data;

public class Seed
{
    public static async Task SeedUsers(AppDbContext context)
    {
        if(await context.Users.AnyAsync()) return;

        var memberData = await File.ReadAllTextAsync("Data/UserSeedData.json");
        var members = JsonSerializer.Deserialize<List<Member>>(memberData);
        if(members == null)
        {
            Console.WriteLine("No members found in the seed data.");
            return;
        }

        foreach (var member in members)
        {
            using var hmac = new HMACSHA512();
            var user = new AppUser
            {
                Id = member.Id,
                DisplayName = member.DisplayName.ToLower(),
                Email = $"{member.DisplayName.ToLower()}@example.com",
                ImageUrl = member.ImageUrl,
                PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes("Pa$$w0rd")),
                PasswordSalt = hmac.Key,
                Member = new Member
                {
                    Id = member.Id,
                    DisplayName = member.DisplayName.ToLower(),
                    ImageUrl = member.ImageUrl,
                    Description = member.Description,
                    DateOfBirth = member.DateOfBirth,
                    Gender = member.Gender,
                    City = member.City,
                    Country = member.Country,
                    LastActive = member.LastActive,
                    Created = member.Created
                }
            };   
        
            user.Member.Photos.Add(new Photo
            {
                Url = member.ImageUrl ?? string.Empty,
                MemberId = member.Id
            });

            context.Users.Add(user);
        }

        await context.SaveChangesAsync();
    }
}
