using Microsoft.AspNetCore.Mvc;
using MiniInventory.Application.DTOs;
using MiniInventory.Application.Interfaces;
using MiniInventory.Shared;

namespace MiniInventory.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CategoryController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoryController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var categories = await _categoryService.GetAllAsync();
            var successResponse = CommonResponse<IEnumerable<CategoryDto>>.SuccessResponse(categories, "Categories retrieved successfully.");
            return Ok(successResponse);
        }
        catch (Exception ex)
        {
            var errorResponse = CommonResponse<IEnumerable<CategoryDto>>.ErrorResponse("An error occurred while retrieving categories.", new List<string> { ex.Message });
            return StatusCode(500, errorResponse);
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var category = await _categoryService.GetByIdAsync(id);
            if (category == null)
            {
                var errorResponse = CommonResponse<CategoryDto>.ErrorResponse($"Category with ID {id} not found.");
                return NotFound(errorResponse);
            }

            var successResponse = CommonResponse<CategoryDto>.SuccessResponse(category, "Category retrieved successfully.");
            return Ok(successResponse);
        }
        catch (Exception ex)
        {
            var errorResponse = CommonResponse<CategoryDto>.ErrorResponse("An error occurred while retrieving the category.", new List<string> { ex.Message });
            return StatusCode(500, errorResponse);
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CategoryCreateDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                var errorResponse = CommonResponse<CategoryCreateDto>.ErrorResponse("Validation failed.", errors);
                return BadRequest(errorResponse);
            }

            var id = await _categoryService.CreateAsync(dto);
            var successResponse = CommonResponse<int>.SuccessResponse(id, "Category created successfully.");
            return CreatedAtAction(nameof(GetById), new { id }, successResponse);
        }
        catch (Exception ex)
        {
            var errorResponse = CommonResponse<CategoryCreateDto>.ErrorResponse("An error occurred while creating the category.", new List<string> { ex.Message });
            return StatusCode(500, errorResponse);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CategoryCreateDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                var errorResponse = CommonResponse<CategoryCreateDto>.ErrorResponse("Validation failed.", errors);
                return BadRequest(errorResponse);
            }

            var result = await _categoryService.UpdateAsync(id, dto);
            if (result == 0)
            {
                var errorResponse = CommonResponse<CategoryCreateDto>.ErrorResponse($"Category with ID {id} not found.");
                return NotFound(errorResponse);
            }

            var successResponse = CommonResponse<int>.SuccessResponse(result, "Category updated successfully.");
            return Ok(successResponse);
        }
        catch (Exception ex)
        {
            var errorResponse = CommonResponse<CategoryCreateDto>.ErrorResponse("An error occurred while updating the category.", new List<string> { ex.Message });
            return StatusCode(500, errorResponse);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = await _categoryService.DeleteAsync(id);
            if (result == 0)
            {
                var errorResponse = CommonResponse<int>.ErrorResponse($"Category with ID {id} not found.");
                return NotFound(errorResponse);
            }

            var successResponse = CommonResponse<int>.SuccessResponse(result, "Category deleted successfully.");
            return Ok(successResponse);
        }
        catch (Exception ex)
        {
            var errorResponse = CommonResponse<int>.ErrorResponse("An error occurred while deleting the category.", new List<string> { ex.Message });
            return StatusCode(500, errorResponse);
        }
    }
}