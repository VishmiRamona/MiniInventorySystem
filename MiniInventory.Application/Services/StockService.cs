using Microsoft.Extensions.Logging;
using MiniInventory.Application.DTOs;
using MiniInventory.Application.Interfaces;
using MiniInventory.Domain.Entities;

namespace MiniInventory.Application.Services;

public class StockService : IStockService
{
    private readonly IItemRepository _itemRepository;
    private readonly IStockInRepository _stockInRepository;
    private readonly IStockOutRepository _stockOutRepository;
    private readonly ILogger<StockService> _logger;

    public StockService(
        IItemRepository itemRepository,
        IStockInRepository stockInRepository,
        IStockOutRepository stockOutRepository,
        ILogger<StockService> logger)
    {
        _itemRepository = itemRepository;
        _stockInRepository = stockInRepository;
        _stockOutRepository = stockOutRepository;
        _logger = logger;
    }

    public async Task<StockInDto> StockInAsync(StockInCreateDto dto)
    {
        try
        {
            // Validate Item exists
            var item = await _itemRepository.GetByIdAsync(dto.ItemId);
            if (item == null)
                throw new Exception($"Item with ID {dto.ItemId} not found.");

            // Create StockIn record
            var stockIn = new StockIn
            {
                ItemId = dto.ItemId,
                SupplierId = dto.SupplierId,
                Quantity = dto.Quantity,
                CostPrice = dto.CostPrice,
                StockInDate = DateTime.Now,
                CreatedDate = DateTime.Now
            };

            await _stockInRepository.CreateAsync(stockIn);

            // Return DTO
            return new StockInDto
            {
                StockInId = stockIn.StockInId,
                ItemId = stockIn.ItemId,
                ItemName = item.ItemName,
                SupplierId = stockIn.SupplierId,
                SupplierName = "Supplier",
                Quantity = stockIn.Quantity,
                CostPrice = stockIn.CostPrice,
                StockInDate = stockIn.StockInDate
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in StockInAsync for ItemId: {ItemId}", dto.ItemId);
            throw;
        }
    }

    public async Task<StockOutDto> StockOutAsync(StockOutCreateDto dto)
    {
        try
        {
            // Validate Item exists
            var item = await _itemRepository.GetByIdAsync(dto.ItemId);
            if (item == null)
                throw new Exception($"Item with ID {dto.ItemId} not found.");

            // Calculate current balance to check if we have enough stock
            var stockIns = await _stockInRepository.GetByItemIdAsync(dto.ItemId);
            var stockOuts = await _stockOutRepository.GetByItemIdAsync(dto.ItemId);
            var currentBalance = stockIns.Sum(s => s.Quantity) - stockOuts.Sum(s => s.Quantity);

            if (currentBalance < dto.Quantity)
                throw new Exception($"Insufficient stock. Current balance: {currentBalance}, Requested: {dto.Quantity}");

            // Create StockOut record
            var stockOut = new StockOut
            {
                ItemId = dto.ItemId,
                Quantity = dto.Quantity,
                Reason = dto.Reason,
                StockOutDate = DateTime.Now,
                CreatedDate = DateTime.Now
            };

            await _stockOutRepository.CreateAsync(stockOut);

            // Return DTO
            return new StockOutDto
            {
                StockOutId = stockOut.StockOutId,
                ItemId = stockOut.ItemId,
                ItemName = item.ItemName,
                Quantity = stockOut.Quantity,
                Reason = stockOut.Reason,
                StockOutDate = stockOut.StockOutDate
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in StockOutAsync for ItemId: {ItemId}", dto.ItemId);
            throw;
        }
    }

    public async Task<IEnumerable<StockBalanceDto>> GetBalanceReportAsync()
    {
        try
        {
            var items = await _itemRepository.GetAllAsync();
            var result = new List<StockBalanceDto>();

            foreach (var item in items)
            {
                var stockIns = await _stockInRepository.GetByItemIdAsync(item.ItemId);
                var stockOuts = await _stockOutRepository.GetByItemIdAsync(item.ItemId);

                var totalIn = stockIns.Sum(s => s.Quantity);
                var totalOut = stockOuts.Sum(s => s.Quantity);
                var currentBalance = totalIn - totalOut;

                string stockStatus;
                if (currentBalance <= 0)
                    stockStatus = "Out of Stock";
                else if (currentBalance < item.ReorderLevel)
                    stockStatus = "Low Stock";
                else
                    stockStatus = "Good Stock";

                result.Add(new StockBalanceDto
                {
                    ItemId = item.ItemId,
                    ItemCode = item.ItemCode,
                    ItemName = item.ItemName,
                    CategoryName = item.Category?.CategoryName ?? "N/A",
                    TotalStockIn = totalIn,
                    TotalStockOut = totalOut,
                    CurrentBalance = currentBalance,
                    ReorderLevel = item.ReorderLevel,
                    StockStatus = stockStatus
                });
            }

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetBalanceReportAsync");
            throw;
        }
    }

    public async Task<IEnumerable<ItemDto>> GetLowStockItemsAsync()
    {
        try
        {
            var items = await _itemRepository.GetAllAsync();
            var lowStockItems = new List<ItemDto>();

            foreach (var item in items)
            {
                var stockIns = await _stockInRepository.GetByItemIdAsync(item.ItemId);
                var stockOuts = await _stockOutRepository.GetByItemIdAsync(item.ItemId);
                var currentBalance = stockIns.Sum(s => s.Quantity) - stockOuts.Sum(s => s.Quantity);

                if (currentBalance <= item.ReorderLevel)
                {
                    lowStockItems.Add(new ItemDto
                    {
                        ItemId = item.ItemId,
                        ItemCode = item.ItemCode,
                        Barcode = item.Barcode,
                        ItemName = item.ItemName,
                        CategoryId = item.CategoryId,
                        CategoryName = item.Category?.CategoryName ?? "N/A",
                        SupplierId = item.SupplierId,
                        SupplierName = item.Supplier?.SupplierName ?? "N/A",
                        CostPrice = item.CostPrice,
                        SellingPrice = item.SellingPrice,
                        ReorderLevel = item.ReorderLevel,
                        IsActive = item.IsActive
                    });
                }
            }

            return lowStockItems;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetLowStockItemsAsync");
            throw;
        }
    }
}