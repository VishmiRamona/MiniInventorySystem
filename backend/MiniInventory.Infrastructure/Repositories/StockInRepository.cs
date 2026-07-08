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
        _context.StockIns.Add(stockIn);
        return await _context.SaveChangesAsync();
    }

    public async Task<int> UpdateAsync(StockIn stockIn)
    {
        _context.StockIns.Update(stockIn);
        return await _context.SaveChangesAsync();
    }

    public async Task<int> DeleteAsync(int id)
    {
        var stockIn = await _context.StockIns.FindAsync(id);
        if (stockIn == null) return 0;

        _context.StockIns.Remove(stockIn);
        return await _context.SaveChangesAsync();
    }
}