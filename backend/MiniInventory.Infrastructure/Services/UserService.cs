using Microsoft.EntityFrameworkCore;
using MiniInventory.Application.DTOs;
using MiniInventory.Application.Interfaces;
using MiniInventory.Domain.Entities;
using MiniInventory.Infrastructure.Data;

namespace MiniInventory.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<UserDto>> GetAllAsync()
    {
        var users = await _context.Users
            .OrderBy(u => u.UserId)
            .ToListAsync();

        return users.Select(u => new UserDto
        {
            UserId = u.UserId,
            Username = u.Username,
            Email = u.Email,
            PasswordHash = u.PasswordHash,
            Role = u.Role,
            IsActive = u.IsActive,
            CreatedDate = u.CreatedDate
        });
    }

    public async Task<UserDto?> GetByIdAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return null;

        return new UserDto
        {
            UserId = user.UserId,
            Username = user.Username,
            Email = user.Email,
            PasswordHash = user.PasswordHash,
            Role = user.Role,
            IsActive = user.IsActive,
            CreatedDate = user.CreatedDate
        };
    }

    public async Task<UserDto?> GetByUsernameAsync(string username)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == username);
        if (user == null) return null;

        return new UserDto
        {
            UserId = user.UserId,
            Username = user.Username,
            Email = user.Email,
            PasswordHash = user.PasswordHash,
            Role = user.Role,
            IsActive = user.IsActive,
            CreatedDate = user.CreatedDate
        };
    }

    public async Task<int> CreateAsync(UserCreateDto dto)
    {
        var user = new User
        {
            Username = dto.Username ?? string.Empty,
            Email = dto.Email ?? string.Empty,
            PasswordHash = dto.Password ?? string.Empty,
            Role = dto.Role ?? "Staff",
            IsActive = dto.IsActive,
            CreatedDate = DateTime.Now
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user.UserId;
    }

    public async Task<int> UpdateAsync(int id, UserCreateDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return 0;

        user.Username = dto.Username ?? user.Username;
        user.Email = dto.Email ?? user.Email;
        user.Role = dto.Role ?? user.Role;
        user.IsActive = dto.IsActive;

        if (!string.IsNullOrEmpty(dto.Password))
        {
            user.PasswordHash = dto.Password;
        }

        await _context.SaveChangesAsync();
        return 1;
    }

    public async Task<int> DeleteAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return 0;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return 1;
    }
}