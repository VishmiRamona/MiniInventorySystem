using MiniInventory.Domain.Entities;

namespace MiniInventory.Application.Interfaces;

public interface IItemRepository
{
    Task<IEnumerable<Item>> GetAllAsync();
    Task<Item?> GetByIdAsync(int id);
    Task<IEnumerable<Item>> SearchAsync(string keyword);
    Task<int> CreateAsync(Item item);
    Task<int> UpdateAsync(Item item);
    Task<int> DeleteAsync(int id);
}