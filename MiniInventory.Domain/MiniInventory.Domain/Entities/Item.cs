using MiniInventory.Domain.Entities;

namespace MiniInventory.Domain.Entities;

public class Item
{
    public int ItemId { get; set; }
    public string? ItemCode { get; set; }
    public string? Barcode { get; set; }
    public string? ItemName { get; set; }
    public int CategoryId { get; set; }
    public int SupplierId { get; set; }
    public decimal CostPrice { get; set; }
    public decimal SellingPrice { get; set; }
    public int ReorderLevel { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedDate { get; set; }

    // Navigation Properties
    public Category? Category { get; set; }
    public Supplier? Supplier { get; set; }
}