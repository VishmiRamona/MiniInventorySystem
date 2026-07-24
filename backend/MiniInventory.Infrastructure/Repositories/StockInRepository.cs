using Microsoft.EntityFrameworkCore;
using MiniInventory.Application.Interfaces;
using MiniInventory.Domain.Entities;
using MiniInventory.Infrastructure.Data;

namespace MiniInventory.Infrastructure.Repositories;

public class StockInRepository : IStockInRepository
{
    private readonly AppDbContext _context;

    public StockInRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<StockIn>> GetAllAsync()
    {
        return await _context.StockIns
            .Include(s => s.Item)
            .Include(s => s.Supplier)
            .ToListAsync();
    }

    public async Task<StockIn?> GetByIdAsync(int id)
    {
        return await _context.StockIns
            .Include(s => s.Item)
            .Include(s => s.Supplier)
            .FirstOrDefaultAsync(s => s.StockInId == id);
    }

    public async Task<IEnumerable<StockIn>> GetByItemIdAsync(int itemId)
    {
        return await _context.StockIns
            .Include(s => s.Item)
            .Include(s => s.Supplier)
            .Where(s => s.ItemId == itemId)
            .ToListAsync();
    }

    public async Task<int> CreateAsync(StockIn stockIn)
    {
        var result = await _context.Database
            .ExecuteSqlRawAsync("EXEC usp_StockIn_Create @ItemId = {0}, @SupplierId = {1}, @Quantity = {2}, @CostPrice = {3}",
                stockIn.ItemId,
                stockIn.SupplierId,
                stockIn.Quantity,
                stockIn.CostPrice);

        return result;
    }

    public async Task<int> UpdateAsync(StockIn stockIn)
    {
        var result = await _context.Database
            .ExecuteSqlRawAsync("EXEC usp_StockIn_Update @StockInId = {0}, @ItemId = {1}, @SupplierId = {2}, @Quantity = {3}, @CostPrice = {4}",
                stockIn.StockInId,
                stockIn.ItemId,
                stockIn.SupplierId,
                stockIn.Quantity,
                stockIn.CostPrice);

        return result;
    }

    public async Task<int> DeleteAsync(int id)
    {
        var result = await _context.Database
            .ExecuteSqlRawAsync("EXEC usp_StockIn_Delete @StockInId = {0}", id);

        return result;
    }
}