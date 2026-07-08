using MiniInventory.Application.DTOs;

namespace MiniInventory.Application.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<CategoryDto>> GetAllAsync();
    Task<CategoryDto?> GetByIdAsync(int id);
    Task<int> CreateAsync(CategoryCreateDto dto);
    Task<int> UpdateAsync(int id, CategoryCreateDto dto);
    Task<int> DeleteAsync(int id);
}