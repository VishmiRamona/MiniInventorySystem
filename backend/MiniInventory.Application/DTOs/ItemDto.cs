namespace MiniInventory.Application.DTOs;

public class ItemDto
{
    public int ItemId { get; set; }
    public string? ItemCode { get; set; }
    public string? Barcode { get; set; }
    public string? ItemName { get; set; }
    public int CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public int SupplierId { get; set; }
    public string? SupplierName { get; set; }
    public decimal CostPrice { get; set; }
    public decimal SellingPrice { get; set; }
    public int ReorderLevel { get; set; }
    public bool IsActive { get; set; }
    public string? StockStatus { get; set; }
    public decimal CurrentBalance { get; set; }
}