using System;

namespace MiniInventory.Domain.Entities
{
    public class StockOut
    {
        public int StockOutId { get; set; }
        public int ItemId { get; set; }
        public int Quantity { get; set; }
        public string Reason { get; set; } = string.Empty;
        public DateTime StockOutDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public virtual Item? Item { get; set; }
    }
}