using MiniInventory.Application.DTOs;
using MiniInventory.Application.Interfaces;
using MiniInventory.Domain.Entities;

namespace MiniInventory.Application.Services;

public class SupplierService : ISupplierService
{
    private readonly ISupplierRepository _supplierRepository;

    public SupplierService(ISupplierRepository supplierRepository)
    {
        _supplierRepository = supplierRepository;
    }

    public async Task<IEnumerable<SupplierDto>> GetAllAsync()
    {
        var suppliers = await _supplierRepository.GetAllAsync();
        return suppliers.Select(s => new SupplierDto
        {
            SupplierId = s.SupplierId,
            SupplierName = s.SupplierName,
            ContactNumber = s.ContactNumber,
            Email = s.Email,
            Address = s.Address,
            IsActive = s.IsActive
        });
    }

    // FIXED: Added '?' to return type
    public async Task<SupplierDto?> GetByIdAsync(int id)
    {
        var supplier = await _supplierRepository.GetByIdAsync(id);
        if (supplier == null) return null;

        return new SupplierDto
        {
            SupplierId = supplier.SupplierId,
            SupplierName = supplier.SupplierName,
            ContactNumber = supplier.ContactNumber,
            Email = supplier.Email,
            Address = supplier.Address,
            IsActive = supplier.IsActive
        };
    }

    public async Task<int> CreateAsync(SupplierCreateDto dto)
    {
        var supplier = new Supplier
        {
            SupplierName = dto.SupplierName,
            ContactNumber = dto.ContactNumber,
            Email = dto.Email,
            Address = dto.Address,
            IsActive = true,
            CreatedDate = DateTime.Now
        };

        return await _supplierRepository.CreateAsync(supplier);
    }

    public async Task<int> UpdateAsync(int id, SupplierCreateDto dto)
    {
        var existing = await _supplierRepository.GetByIdAsync(id);
        if (existing == null) return 0;

        existing.SupplierName = dto.SupplierName;
        existing.ContactNumber = dto.ContactNumber;
        existing.Email = dto.Email;
        existing.Address = dto.Address;

        return await _supplierRepository.UpdateAsync(existing);
    }

    public async Task<int> DeleteAsync(int id)
    {
        return await _supplierRepository.DeleteAsync(id);
    }
}