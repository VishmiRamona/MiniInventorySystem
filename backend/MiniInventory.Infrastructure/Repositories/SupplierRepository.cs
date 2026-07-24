using Microsoft.EntityFrameworkCore;
using MiniInventory.Application.Interfaces;
using MiniInventory.Domain.Entities;
using MiniInventory.Infrastructure.Data;

namespace MiniInventory.Infrastructure.Repositories;

public class SupplierRepository : ISupplierRepository
{
    private readonly AppDbContext _context;

    public SupplierRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Supplier>> GetAllAsync()
    {
        return await _context.Suppliers.ToListAsync();
    }

    public async Task<Supplier?> GetByIdAsync(int id)
    {
        return await _context.Suppliers.FindAsync(id);
    }

    public async Task<int> CreateAsync(Supplier supplier)
    {
        var result = await _context.Database
            .ExecuteSqlRawAsync("EXEC usp_Supplier_Create @SupplierName = {0}, @ContactNumber = {1}, @Email = {2}, @Address = {3}, @IsActive = {4}",
                supplier.SupplierName,
                supplier.ContactNumber ?? (object)DBNull.Value,
                supplier.Email ?? (object)DBNull.Value,
                supplier.Address ?? (object)DBNull.Value,
                supplier.IsActive);

        return result;
    }

    public async Task<int> UpdateAsync(Supplier supplier)
    {
        var result = await _context.Database
            .ExecuteSqlRawAsync("EXEC usp_Supplier_Update @SupplierId = {0}, @SupplierName = {1}, @ContactNumber = {2}, @Email = {3}, @Address = {4}, @IsActive = {5}",
                supplier.SupplierId,
                supplier.SupplierName,
                supplier.ContactNumber ?? (object)DBNull.Value,
                supplier.Email ?? (object)DBNull.Value,
                supplier.Address ?? (object)DBNull.Value,
                supplier.IsActive);

        return result;
    }

    public async Task<int> DeleteAsync(int id)
    {
        var result = await _context.Database
            .ExecuteSqlRawAsync("EXEC usp_Supplier_Delete @SupplierId = {0}", id);

        return result;
    }

    public async Task<bool> HasStockInsAsync(int supplierId)
    {
        return await _context.StockIns.AnyAsync(s => s.SupplierId == supplierId);
    }
}