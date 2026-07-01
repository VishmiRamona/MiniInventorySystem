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
        _context.Suppliers.Add(supplier);
        return await _context.SaveChangesAsync();
    }

    public async Task<int> UpdateAsync(Supplier supplier)
    {
        _context.Suppliers.Update(supplier);
        return await _context.SaveChangesAsync();
    }

    public async Task<int> DeleteAsync(int id)
    {
        var supplier = await _context.Suppliers.FindAsync(id);
        if (supplier == null) return 0;

        _context.Suppliers.Remove(supplier);
        return await _context.SaveChangesAsync();
    }

    public async Task<bool> HasStockInsAsync(int supplierId)
    {
        return await _context.StockIns.AnyAsync(s => s.SupplierId == supplierId);
    }
}