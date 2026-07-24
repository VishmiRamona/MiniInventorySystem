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

        var ids = await _context.Database
            .SqlQueryRaw<int>("EXEC usp_Item_Search @Keyword = {0}", keyword)
            .ToListAsync();

        if (!ids.Any())
            return new List<Item>();

        return await _context.Items
            .Include(i => i.Category)
            .Include(i => i.Supplier)
            .Where(i => ids.Contains(i.ItemId))
            .ToListAsync();
    }

    public async Task<int> CreateAsync(Item item)
    {
        var result = await _context.Database
            .ExecuteSqlRawAsync("EXEC usp_Item_Create @ItemCode = {0}, @Barcode = {1}, @ItemName = {2}, @CategoryId = {3}, @SupplierId = {4}, @CostPrice = {5}, @SellingPrice = {6}, @ReorderLevel = {7}, @IsActive = {8}",
                item.ItemCode,
                item.Barcode ?? (object)DBNull.Value,
                item.ItemName,
                item.CategoryId,
                item.SupplierId,
                item.CostPrice,
                item.SellingPrice,
                item.ReorderLevel,
                item.IsActive);

        return result;
    }

    public async Task<int> UpdateAsync(Item item)
    {
        var result = await _context.Database
            .ExecuteSqlRawAsync("EXEC usp_Item_Update @ItemId = {0}, @ItemCode = {1}, @Barcode = {2}, @ItemName = {3}, @CategoryId = {4}, @SupplierId = {5}, @CostPrice = {6}, @SellingPrice = {7}, @ReorderLevel = {8}, @IsActive = {9}",
                item.ItemId,
                item.ItemCode,
                item.Barcode ?? (object)DBNull.Value,
                item.ItemName,
                item.CategoryId,
                item.SupplierId,
                item.CostPrice,
                item.SellingPrice,
                item.ReorderLevel,
                item.IsActive);

        return result;
    }

    public async Task<int> DeleteAsync(int id)
    {
        var result = await _context.Database
            .ExecuteSqlRawAsync("EXEC usp_Item_Delete @ItemId = {0}", id);

        return result;
    }

    public async Task<Category?> GetCategoryByIdAsync(int categoryId)
    {
        return await _context.Categories
            .FirstOrDefaultAsync(c => c.CategoryId == categoryId);
    }
}