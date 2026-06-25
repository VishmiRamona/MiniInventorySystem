namespace MiniInventory.Application.DTOs;

public class CategoryDto
{
    public int CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
}