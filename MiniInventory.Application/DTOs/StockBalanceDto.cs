namespace MiniInventory.Application.DTOs;

public class StockBalanceDto
{
    public int ItemId { get; set; }
    public string? ItemCode { get; set; }
    public string? ItemName { get; set; }
    public string? CategoryName { get; set; }
    public int TotalStockIn { get; set; }
    public int TotalStockOut { get; set; }
    public int CurrentBalance { get; set; }
    public int ReorderLevel { get; set; }
    public string? StockStatus { get; set; } // "Good Stock", "Low Stock", "Out of Stock"
    public decimal CostPrice { get; set; }
}