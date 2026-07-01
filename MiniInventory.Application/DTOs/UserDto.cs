namespace MiniInventory.Application.DTOs;

public class UserDto
{
    public int UserId { get; set; }
    public string? Username { get; set; }
    public string? Email { get; set; }
    public string? PasswordHash { get; set; }
    public string? Role { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedDate { get; set; }
}

public class UserCreateDto
{
    public string? Username { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
    public string? Role { get; set; }
    public bool IsActive { get; set; } = true;
}