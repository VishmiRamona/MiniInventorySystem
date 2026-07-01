using MiniInventory.Application.DTOs;

namespace MiniInventory.Application.Interfaces;

public interface IUserService
{
    Task<IEnumerable<UserDto>> GetAllAsync();
    Task<UserDto?> GetByIdAsync(int id);
    Task<UserDto?> GetByUsernameAsync(string username);
    Task<int> CreateAsync(UserCreateDto dto);
    Task<int> UpdateAsync(int id, UserCreateDto dto);
    Task<int> DeleteAsync(int id);
}