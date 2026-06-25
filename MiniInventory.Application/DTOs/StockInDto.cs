namespace MiniInventory.Application.DTOs;

public class StockInDto
{
    public int StockInId { get; set; }
    public int ItemId { get; set; }
    public string? ItemName { get; set; }
    public int SupplierId { get; set; }
    public string? SupplierName { get; set; }
    public int Quantity { get; set; }
    public decimal CostPrice { get; set; }
    public DateTime StockInDate { get; set; }
}