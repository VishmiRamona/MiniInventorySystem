using MiniInventory.Domain.Entities;

namespace MiniInventory.Application.Interfaces;

public interface IStockInRepository
{
    Task<IEnumerable<StockIn>> GetAllAsync();
    Task<StockIn?> GetByIdAsync(int id);
    Task<IEnumerable<StockIn>> GetByItemIdAsync(int itemId);
    Task<int> CreateAsync(StockIn stockIn);
    Task<int> UpdateAsync(StockIn stockIn);
    Task<int> DeleteAsync(int id);
}