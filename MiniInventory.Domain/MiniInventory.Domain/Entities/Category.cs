namespace MiniInventory.Domain.Entities;

public class Category
{
    public int CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedDate { get; set; }

    // Navigation Property (Collection - one Category has many Items)
    public ICollection<Item>? Items { get; set; }
}