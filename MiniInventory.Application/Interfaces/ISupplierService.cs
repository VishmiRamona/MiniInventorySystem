using MiniInventory.Application.DTOs;

namespace MiniInventory.Application.Interfaces;

public interface ISupplierService
{
    Task<IEnumerable<SupplierDto>> GetAllAsync();
    Task<SupplierDto?> GetByIdAsync(int id);  // <-- '?' HERE
    Task<int> CreateAsync(SupplierCreateDto dto);
    Task<int> UpdateAsync(int id, SupplierCreateDto dto);
    Task<int> DeleteAsync(int id);
}