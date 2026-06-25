namespace MiniInventory.Application.DTOs;

public class StockOutCreateDto
{
    public int ItemId { get; set; }
    public int Quantity { get; set; }
    public string? Reason { get; set; }
}