using System;
using System.Collections.Generic;

namespace MiniInventory.Domain.Entities
{
    public class Category
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }

        // Navigation property (one-to-many)
        // Initialize to avoid null reference warnings
        public virtual ICollection<Item> Items { get; set; } = new List<Item>();
    }
}