using Microsoft.AspNetCore.Mvc;
using MiniInventory.Application.DTOs;
using MiniInventory.Application.Interfaces;
using MiniInventory.Shared;

namespace MiniInventory.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class StockController : ControllerBase
{
    private readonly IStockService _stockService;

    public StockController(IStockService stockService)
    {
        _stockService = stockService;
    }

    [HttpPost("in")]
    public async Task<IActionResult> StockIn([FromBody] StockInCreateDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                var errorResponse = CommonResponse<StockInCreateDto>.ErrorResponse("Validation failed.", errors);
                return BadRequest(errorResponse);
            }

            var result = await _stockService.StockInAsync(dto);
            var successResponse = CommonResponse<StockInDto>.SuccessResponse(result, "Stock In recorded successfully.");
            return Ok(successResponse);
        }
        catch (Exception ex)
        {
            var errorResponse = CommonResponse<StockInDto>.ErrorResponse("An error occurred while recording Stock In.", new List<string> { ex.Message });
            return StatusCode(500, errorResponse);
        }
    }

    [HttpPost("out")]
    public async Task<IActionResult> StockOut([FromBody] StockOutCreateDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                var errorResponse = CommonResponse<StockOutCreateDto>.ErrorResponse("Validation failed.", errors);
                return BadRequest(errorResponse);
            }

            var result = await _stockService.StockOutAsync(dto);
            var successResponse = CommonResponse<StockOutDto>.SuccessResponse(result, "Stock Out recorded successfully.");
            return Ok(successResponse);
        }
        catch (Exception ex)
        {
            var errorResponse = CommonResponse<StockOutDto>.ErrorResponse("An error occurred while recording Stock Out.", new List<string> { ex.Message });
            return StatusCode(500, errorResponse);
        }
    }

    [HttpGet("balance")]
    public async Task<IActionResult> GetBalanceReport()
    {
        try
        {
            var report = await _stockService.GetBalanceReportAsync();
            var successResponse = CommonResponse<IEnumerable<StockBalanceDto>>.SuccessResponse(report, "Balance report retrieved successfully.");
            return Ok(successResponse);
        }
        catch (Exception ex)
        {
            var errorResponse = CommonResponse<IEnumerable<StockBalanceDto>>.ErrorResponse("An error occurred while retrieving the balance report.", new List<string> { ex.Message });
            return StatusCode(500, errorResponse);
        }
    }

    [HttpGet("low-stock")]
    public async Task<IActionResult> GetLowStock()
    {
        try
        {
            var lowStockItems = await _stockService.GetLowStockItemsAsync();
            var successResponse = CommonResponse<IEnumerable<ItemDto>>.SuccessResponse(lowStockItems, "Low stock items retrieved successfully.");
            return Ok(successResponse);
        }
        catch (Exception ex)
        {
            var errorResponse = CommonResponse<IEnumerable<ItemDto>>.ErrorResponse("An error occurred while retrieving low stock items.", new List<string> { ex.Message });
            return StatusCode(500, errorResponse);
        }
    }
}