using MiniInventory.Domain.Entities;

namespace MiniInventory.Application.Interfaces;

public interface IStockOutRepository
{
    Task<IEnumerable<StockOut>> GetAllAsync();
    Task<StockOut?> GetByIdAsync(int id);
    Task<IEnumerable<StockOut>> GetByItemIdAsync(int itemId);
    Task<int> CreateAsync(StockOut stockOut);
    Task<int> UpdateAsync(StockOut stockOut);
    Task<int> DeleteAsync(int id);
}