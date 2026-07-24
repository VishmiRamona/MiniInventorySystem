using Microsoft.EntityFrameworkCore;
using MiniInventory.Application.Interfaces;
using MiniInventory.Domain.Entities;
using MiniInventory.Infrastructure.Data;

namespace MiniInventory.Infrastructure.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly AppDbContext _context;

    public CategoryRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Category>> GetAllAsync()
    {
        return await _context.Categories
            .FromSqlRaw("EXEC usp_Category_GetAll")
            .ToListAsync();
    }

    public async Task<Category?> GetByIdAsync(int id)
    {
        return await _context.Categories
            .FromSqlRaw("EXEC usp_Category_GetById @Id = {0}", id)
            .FirstOrDefaultAsync();
    }

    public async Task<int> CreateAsync(Category category)
    {
        var result = await _context.Database
            .ExecuteSqlRawAsync("EXEC usp_Category_Create @CategoryName = {0}, @Description = {1}, @IsActive = {2}",
                category.CategoryName,
                category.Description ?? (object)DBNull.Value,
                category.IsActive);

        return result;
    }

    public async Task<int> UpdateAsync(Category category)
    {
        var result = await _context.Database
            .ExecuteSqlRawAsync("EXEC usp_Category_Update @CategoryId = {0}, @CategoryName = {1}, @Description = {2}, @IsActive = {3}",
                category.CategoryId,
                category.CategoryName,
                category.Description ?? (object)DBNull.Value,
                category.IsActive);

        return result;
    }

    public async Task<int> DeleteAsync(int id)
    {
        var result = await _context.Database
            .ExecuteSqlRawAsync("EXEC usp_Category_Delete @CategoryId = {0}", id);

        return result;
    }

    public async Task<IEnumerable<Category>> SearchAsync(string keyword)
    {
        return await _context.Categories
            .FromSqlRaw("EXEC usp_Category_Search @Keyword = {0}", keyword ?? "")
            .ToListAsync();
    }
}