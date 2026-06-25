namespace MiniInventory.Domain.Entities;

public class StockOut
{
    public int StockOutId { get; set; }
    public int ItemId { get; set; }
    public int Quantity { get; set; }
    public string? Reason { get; set; }
    public DateTime StockOutDate { get; set; }
    public DateTime CreatedDate { get; set; }

    // Navigation Property
    public Item? Item { get; set; }
}