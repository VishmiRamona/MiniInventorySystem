using Microsoft.EntityFrameworkCore;
using MiniInventory.Application.Interfaces;
using MiniInventory.Domain.Entities;
using MiniInventory.Infrastructure.Data;

namespace MiniInventory.Infrastructure.Repositories;

public class ItemRepository : IItemRepository
{
    private readonly AppDbContext _context;

    public ItemRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Item>> GetAllAsync()
    {
        return await _context.Items
            .Include(i => i.Category)
            .Include(i => i.Supplier)
            .ToListAsync();
    }

    public async Task<Item?> GetByIdAsync(int id)
    {
        return await _context.Items
            .Include(i => i.Category)
            .Include(i => i.Supplier)
            .FirstOrDefaultAsync(i => i.ItemId == id);
    }

    public async Task<IEnumerable<Item>> SearchAsync(string keyword)
    {
        if (string.IsNullOrWhiteSpace(keyword))
        {
            return await GetAllAsync();
        }

        return await _context.Items
            .Include(i => i.Category)
            .Include(i => i.Supplier)
            .Where(i => (i.ItemName != null && i.ItemName.Contains(keyword)) ||
                        (i.ItemCode != null && i.ItemCode.Contains(keyword)) ||
                        (i.Barcode != null && i.Barcode.Contains(keyword)))
            .ToListAsync();
    }

    public async Task<int> CreateAsync(Item item)
    {
        _context.Items.Add(item);
        return await _context.SaveChangesAsync();
    }

    public async Task<int> UpdateAsync(Item item)
    {
        _context.Items.Update(item);
        return await _context.SaveChangesAsync();
    }

    public async Task<int> DeleteAsync(int id)
    {
        var item = await _context.Items.FindAsync(id);
        if (item == null) return 0;

        _context.Items.Remove(item);
        return await _context.SaveChangesAsync();
    }
}