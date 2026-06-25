using Microsoft.AspNetCore.Mvc;
using MiniInventory.Application.DTOs;
using MiniInventory.Application.Interfaces;
using MiniInventory.Shared;

namespace MiniInventory.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ItemController : ControllerBase
{
    private readonly IItemService _itemService;

    public ItemController(IItemService itemService)
    {
        _itemService = itemService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var items = await _itemService.GetAllAsync();
            var successResponse = CommonResponse<IEnumerable<ItemDto>>.SuccessResponse(items, "Items retrieved successfully.");
            return Ok(successResponse);
        }
        catch (Exception ex)
        {
            var errorResponse = CommonResponse<IEnumerable<ItemDto>>.ErrorResponse("An error occurred while retrieving items.", new List<string> { ex.Message });
            return StatusCode(500, errorResponse);
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var item = await _itemService.GetByIdAsync(id);
            if (item == null)
            {
                var errorResponse = CommonResponse<ItemDto>.ErrorResponse($"Item with ID {id} not found.");
                return NotFound(errorResponse);
            }

            var successResponse = CommonResponse<ItemDto>.SuccessResponse(item, "Item retrieved successfully.");
            return Ok(successResponse);
        }
        catch (Exception ex)
        {
            var errorResponse = CommonResponse<ItemDto>.ErrorResponse("An error occurred while retrieving the item.", new List<string> { ex.Message });
            return StatusCode(500, errorResponse);
        }
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string keyword)
    {
        try
        {
            var items = await _itemService.SearchAsync(keyword);
            var successResponse = CommonResponse<IEnumerable<ItemDto>>.SuccessResponse(items, "Search completed successfully.");
            return Ok(successResponse);
        }
        catch (Exception ex)
        {
            var errorResponse = CommonResponse<IEnumerable<ItemDto>>.ErrorResponse("An error occurred while searching for items.", new List<string> { ex.Message });
            return StatusCode(500, errorResponse);
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ItemCreateDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                var errorResponse = CommonResponse<ItemCreateDto>.ErrorResponse("Validation failed.", errors);
                return BadRequest(errorResponse);
            }

            var id = await _itemService.CreateAsync(dto);
            var successResponse = CommonResponse<int>.SuccessResponse(id, "Item created successfully.");
            return CreatedAtAction(nameof(GetById), new { id }, successResponse);
        }
        catch (Exception ex)
        {
            var errorResponse = CommonResponse<ItemCreateDto>.ErrorResponse("An error occurred while creating the item.", new List<string> { ex.Message });
            return StatusCode(500, errorResponse);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ItemCreateDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                var errorResponse = CommonResponse<ItemCreateDto>.ErrorResponse("Validation failed.", errors);
                return BadRequest(errorResponse);
            }

            var result = await _itemService.UpdateAsync(id, dto);
            if (result == 0)
            {
                var errorResponse = CommonResponse<ItemCreateDto>.ErrorResponse($"Item with ID {id} not found.");
                return NotFound(errorResponse);
            }

            var successResponse = CommonResponse<int>.SuccessResponse(result, "Item updated successfully.");
            return Ok(successResponse);
        }
        catch (Exception ex)
        {
            var errorResponse = CommonResponse<ItemCreateDto>.ErrorResponse("An error occurred while updating the item.", new List<string> { ex.Message });
            return StatusCode(500, errorResponse);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = await _itemService.DeleteAsync(id);
            if (result == 0)
            {
                var errorResponse = CommonResponse<int>.ErrorResponse($"Item with ID {id} not found.");
                return NotFound(errorResponse);
            }

            var successResponse = CommonResponse<int>.SuccessResponse(result, "Item deleted successfully.");
            return Ok(successResponse);
        }
        catch (Exception ex)
        {
            var errorResponse = CommonResponse<int>.ErrorResponse("An error occurred while deleting the item.", new List<string> { ex.Message });
            return StatusCode(500, errorResponse);
        }
    }
}