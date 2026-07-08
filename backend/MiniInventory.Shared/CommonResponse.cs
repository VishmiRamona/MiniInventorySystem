namespace MiniInventory.Shared;

public class CommonResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public List<string>? Errors { get; set; }

    public static CommonResponse<T> SuccessResponse(T data, string message = "Operation completed successfully.")
    {
        return new CommonResponse<T>
        {
            Success = true,
            Message = message,
            Data = data
        };
    }

    public static CommonResponse<T> ErrorResponse(string message, List<string>? errors = null)
    {
        return new CommonResponse<T>
        {
            Success = false,
            Message = message,
            Errors = errors
        };
    }
}