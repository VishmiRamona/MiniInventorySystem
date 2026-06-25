using MiniInventory.Application.DTOs;

namespace MiniInventory.Application.Interfaces;

public interface IStockService
{
    Task<StockInDto> StockInAsync(StockInCreateDto dto);
    Task<StockOutDto> StockOutAsync(StockOutCreateDto dto);
    Task<IEnumerable<StockBalanceDto>> GetBalanceReportAsync();
    Task<IEnumerable<ItemDto>> GetLowStockItemsAsync();
}