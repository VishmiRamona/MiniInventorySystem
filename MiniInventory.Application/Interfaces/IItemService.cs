using MiniInventory.Application.DTOs;

namespace MiniInventory.Application.Interfaces;

public interface IItemService
{
    Task<IEnumerable<ItemDto>> GetAllAsync();
    Task<ItemDto?> GetByIdAsync(int id);  // <-- '?' HERE
    Task<IEnumerable<ItemDto>> SearchAsync(string keyword);
    Task<int> CreateAsync(ItemCreateDto dto);
    Task<int> UpdateAsync(int id, ItemCreateDto dto);
    Task<int> DeleteAsync(int id);
}