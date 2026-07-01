using System;

namespace MiniInventory.Domain.Entities
{
    public class Item
    {
        public int ItemId { get; set; }
        public string ItemCode { get; set; } = string.Empty;
        public string? Barcode { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public int SupplierId { get; set; }
        public decimal CostPrice { get; set; }
        public decimal SellingPrice { get; set; }
        public int ReorderLevel { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }

        // Navigation properties (nullable because EF Core loads them)
        public virtual Category? Category { get; set; }
        public virtual Supplier? Supplier { get; set; }
    }
}