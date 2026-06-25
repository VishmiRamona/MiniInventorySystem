namespace MiniInventory.Application.DTOs;

public class SupplierDto
{
    public int SupplierId { get; set; }
    public string? SupplierName { get; set; }
    public string? ContactNumber { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public bool IsActive { get; set; }
}