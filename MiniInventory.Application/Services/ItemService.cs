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

    // ✅ FIXED: Auto-generate ItemCode based on Category
    public async Task<int> CreateAsync(ItemCreateDto dto)
    {
        // ✅ Get the category to determine prefix
        var category = await _itemRepository.GetCategoryByIdAsync(dto.CategoryId);
        var prefix = GetCategoryPrefix(category?.CategoryName ?? "");

        // ✅ Get all existing items
        var allItems = await _itemRepository.GetAllAsync();

        // ✅ Find the highest number for this prefix
        var maxNumber = 0;
        foreach (var existingItem in allItems)
        {
            var code = existingItem.ItemCode;
            if (code.StartsWith(prefix))
            {
                var numberPart = code.Substring(3);
                if (int.TryParse(numberPart, out int num))
                {
                    if (num > maxNumber) maxNumber = num;
                }
            }
        }

        // ✅ Generate new code: prefix + next number (3 digits)
        var nextNumber = (maxNumber + 1).ToString("D3");
        var itemCode = prefix + nextNumber;

        // ✅ Generate 13-digit Barcode (ISBN-like format)
        var random = new Random();
        var barcode = "978" + random.Next(100000000, 999999999).ToString();

        var item = new Item
        {
            ItemCode = itemCode,
            Barcode = barcode,
            ItemName = dto.ItemName ?? string.Empty,
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

    // ✅ Helper: Get category prefix
    private string GetCategoryPrefix(string categoryName)
    {
        if (string.IsNullOrEmpty(categoryName)) return "GEN";

        var name = categoryName.ToLower().Trim();
        return name switch
        {
            "fiction" => "FIC",
            "non-fiction" => "NFC",
            "science fiction" => "SCF",
            "children's" => "CHI",
            "mystery" => "MYS",
            "thriller" => "THR",
            "horror" => "HOR",
            "romance" => "ROM",
            "biography" => "BIO",
            "history" => "HIS",
            "science" => "SCI",
            "fantasy" => "FAN",
            "drama" => "DRA",
            "poetry" => "POE",
            _ => "GEN"
        };
    }

    public async Task<int> UpdateAsync(int id, ItemCreateDto dto)
    {
        var existing = await _itemRepository.GetByIdAsync(id);
        if (existing == null) return 0;

        existing.Barcode = dto.Barcode;
        existing.ItemName = dto.ItemName ?? string.Empty;
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