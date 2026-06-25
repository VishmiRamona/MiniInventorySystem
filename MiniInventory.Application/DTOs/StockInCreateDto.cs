namespace MiniInventory.Application.DTOs;

public class StockInCreateDto
{
    public int ItemId { get; set; }
    public int SupplierId { get; set; }
    public int Quantity { get; set; }
    public decimal CostPrice { get; set; }
}