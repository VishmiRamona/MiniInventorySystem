using MiniInventory.Domain.Entities;

namespace MiniInventory.Domain.Entities;

public class StockIn
{
    public int StockInId { get; set; }
    public int ItemId { get; set; }
    public int SupplierId { get; set; }
    public int Quantity { get; set; }
    public decimal CostPrice { get; set; }
    public DateTime StockInDate { get; set; }
    public DateTime CreatedDate { get; set; }

    // Navigation Properties
    public Item? Item { get; set; }
    public Supplier? Supplier { get; set; }
}