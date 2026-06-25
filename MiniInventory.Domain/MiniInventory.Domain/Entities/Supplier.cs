namespace MiniInventory.Domain.Entities;

public class Supplier
{
    public int SupplierId { get; set; }
    public string? SupplierName { get; set; }
    public string? ContactNumber { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedDate { get; set; }

    // Navigation Properties (Collections)
    public ICollection<Item>? Items { get; set; }
    public ICollection<StockIn>? StockIns { get; set; }
}