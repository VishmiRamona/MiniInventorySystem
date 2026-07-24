using Microsoft.EntityFrameworkCore;
using MiniInventory.Application.Interfaces;
using MiniInventory.Domain.Entities;
using MiniInventory.Infrastructure.Data;

namespace MiniInventory.Infrastructure.Repositories;

public class StockOutRepository : IStockOutRepository
{
    private readonly AppDbContext _context;

    public StockOutRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<StockOut>> GetAllAsync()
    {
        return await _context.StockOuts
            .Include(s => s.Item)
            .ToListAsync();
    }

    public async Task<StockOut?> GetByIdAsync(int id)
    {
        return await _context.StockOuts
            .Include(s => s.Item)
            .FirstOrDefaultAsync(s => s.StockOutId == id);
    }

    public async Task<IEnumerable<StockOut>> GetByItemIdAsync(int itemId)
    {
        return await _context.StockOuts
            .Include(s => s.Item)
            .Where(s => s.ItemId == itemId)
            .ToListAsync();
    }

    public async Task<int> CreateAsync(StockOut stockOut)
    {
        var result = await _context.Database
            .ExecuteSqlRawAsync("EXEC usp_StockOut_Create @ItemId = {0}, @Quantity = {1}, @Reason = {2}",
                stockOut.ItemId,
                stockOut.Quantity,
                stockOut.Reason);

        return result;
    }

    public async Task<int> UpdateAsync(StockOut stockOut)
    {
        var result = await _context.Database
            .ExecuteSqlRawAsync("EXEC usp_StockOut_Update @StockOutId = {0}, @ItemId = {1}, @Quantity = {2}, @Reason = {3}",
                stockOut.StockOutId,
                stockOut.ItemId,
                stockOut.Quantity,
                stockOut.Reason);

        return result;
    }

    public async Task<int> DeleteAsync(int id)
    {
        var result = await _context.Database
            .ExecuteSqlRawAsync("EXEC usp_StockOut_Delete @StockOutId = {0}", id);

        return result;
    }
}