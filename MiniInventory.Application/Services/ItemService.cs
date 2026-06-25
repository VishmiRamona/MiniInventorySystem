using MiniInventory.Application.DTOs;
using MiniInventory.Application.Interfaces;
using MiniInventory.Domain.Entities;

namespace MiniInventory.Application.Services;

public class ItemService : IItemService
{
    private readonly IItemRepository _itemRepository;

    public ItemService(IItemRepository itemRepository)
    {
        _itemRepository = itemRepository;
    }

    public async Task<IEnumerable<ItemDto>> GetAllAsync()
    {
        var items = await _itemRepository.GetAllAsync();
        return items.Select(i => new ItemDto
        {
            ItemId = i.ItemId,
            ItemCode = i.ItemCode,
            Barcode = i.Barcode,
            ItemName = i.ItemName,
            CategoryId = i.CategoryId,
            CategoryName = i.Category?.CategoryName ?? "N/A",
            SupplierId = i.SupplierId,
            SupplierName = i.Supplier?.SupplierName ?? "N/A",
            CostPrice = i.CostPrice,
            SellingPrice = i.SellingPrice,
            ReorderLevel = i.ReorderLevel,
            IsActive = i.IsActive
        });
    }

    // FIXED: Added '?' to return type
    public async Task<ItemDto?> GetByIdAsync(int id)
    {
        var item = await _itemRepository.GetByIdAsync(id);
        if (item == null) return null;

        return new ItemDto
        {
            ItemId = item.ItemId,
            ItemCode = item.ItemCode,
            Barcode = item.Barcode,
            ItemName = item.ItemName,
            CategoryId = item.CategoryId,
            CategoryName = item.Category?.CategoryName ?? "N/A",
            SupplierId = item.SupplierId,
            SupplierName = item.Supplier?.SupplierName ?? "N/A",
            CostPrice = item.CostPrice,
            SellingPrice = item.SellingPrice,
            ReorderLevel = item.ReorderLevel,
            IsActive = item.IsActive
        };
    }

    public async Task<IEnumerable<ItemDto>> SearchAsync(string keyword)
    {
        var items = await _itemRepository.SearchAsync(keyword);
        return items.Select(i => new ItemDto
        {
            ItemId = i.ItemId,
            ItemCode = i.ItemCode,
            Barcode = i.Barcode,
            ItemName = i.ItemName,
            CategoryId = i.CategoryId,
            CategoryName = i.Category?.CategoryName ?? "N/A",
            SupplierId = i.SupplierId,
            SupplierName = i.Supplier?.SupplierName ?? "N/A",
            CostPrice = i.CostPrice,
            SellingPrice = i.SellingPrice,
            ReorderLevel = i.ReorderLevel,
            IsActive = i.IsActive
        });
    }

    public async Task<int> CreateAsync(ItemCreateDto dto)
    {
        var item = new Item
        {
            ItemCode = dto.ItemCode,
            Barcode = dto.Barcode,
            ItemName = dto.ItemName,
            CategoryId = dto.CategoryId,
            SupplierId = dto.SupplierId,
            CostPrice = dto.CostPrice,
            SellingPrice = dto.SellingPrice,
            ReorderLevel = dto.ReorderLevel,
            IsActive = true,
            CreatedDate = DateTime.Now
        };

        return await _itemRepository.CreateAsync(item);
    }

    public async Task<int> UpdateAsync(int id, ItemCreateDto dto)
    {
        var existing = await _itemRepository.GetByIdAsync(id);
        if (existing == null) return 0;

        existing.ItemCode = dto.ItemCode;
        existing.Barcode = dto.Barcode;
        existing.ItemName = dto.ItemName;
        existing.CategoryId = dto.CategoryId;
        existing.SupplierId = dto.SupplierId;
        existing.CostPrice = dto.CostPrice;
        existing.SellingPrice = dto.SellingPrice;
        existing.ReorderLevel = dto.ReorderLevel;

        return await _itemRepository.UpdateAsync(existing);
    }

    public async Task<int> DeleteAsync(int id)
    {
        return await _itemRepository.DeleteAsync(id);
    }
}