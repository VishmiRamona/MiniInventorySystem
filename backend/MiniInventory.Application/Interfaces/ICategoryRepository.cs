using MiniInventory.Domain.Entities;

namespace MiniInventory.Application.Interfaces;

public interface ICategoryRepository
{
    Task<IEnumerable<Category>> GetAllAsync();
    Task<Category?> GetByIdAsync(int id);
    Task<int> CreateAsync(Category category);
    Task<int> UpdateAsync(Category category);
    Task<int> DeleteAsync(int id);
}