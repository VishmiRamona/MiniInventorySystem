namespace MiniInventory.Application.DTOs;

public class StockOutDto
{
    public int StockOutId { get; set; }
    public int ItemId { get; set; }
    public string? ItemName { get; set; }
    public int Quantity { get; set; }
    public string? Reason { get; set; }
    public DateTime StockOutDate { get; set; }
}