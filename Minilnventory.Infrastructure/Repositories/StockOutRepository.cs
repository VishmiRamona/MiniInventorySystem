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

    // ✅ FIXED: Added .Include() to load Item
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
        _context.StockOuts.Add(stockOut);
        return await _context.SaveChangesAsync();
    }

    public async Task<int> UpdateAsync(StockOut stockOut)
    {
        _context.StockOuts.Update(stockOut);
        return await _context.SaveChangesAsync();
    }

    public async Task<int> DeleteAsync(int id)
    {
        var stockOut = await _context.StockOuts.FindAsync(id);
        if (stockOut == null) return 0;

        _context.StockOuts.Remove(stockOut);
        return await _context.SaveChangesAsync();
    }
}