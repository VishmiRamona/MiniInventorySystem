namespace MiniInventory.Application.DTOs;

public class ItemCreateDto
{
    public string? ItemCode { get; set; }
    public string? Barcode { get; set; }
    public string? ItemName { get; set; }
    public int CategoryId { get; set; }
    public int SupplierId { get; set; }
    public decimal CostPrice { get; set; }
    public decimal SellingPrice { get; set; }
    public int ReorderLevel { get; set; }
}