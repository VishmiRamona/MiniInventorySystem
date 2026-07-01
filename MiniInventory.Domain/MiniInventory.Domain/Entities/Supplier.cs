using System;
using System.Collections.Generic;

namespace MiniInventory.Domain.Entities
{
    public class Supplier
    {
        public int SupplierId { get; set; }
        public string SupplierName { get; set; } = string.Empty;
        public string? ContactNumber { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }

        // Navigation property (one-to-many)
        // Initialize to avoid null reference warnings
        public virtual ICollection<Item> Items { get; set; } = new List<Item>();
    }
}