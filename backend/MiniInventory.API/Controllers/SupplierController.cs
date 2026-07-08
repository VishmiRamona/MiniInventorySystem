using Microsoft.AspNetCore.Mvc;
using MiniInventory.Application.DTOs;
using MiniInventory.Application.Interfaces;
using MiniInventory.Shared;

namespace MiniInventory.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SupplierController : ControllerBase
{
    private readonly ISupplierService _supplierService;

    public SupplierController(ISupplierService supplierService)
    {
        _supplierService = supplierService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var suppliers = await _supplierService.GetAllAsync();
            var successResponse = CommonResponse<IEnumerable<SupplierDto>>.SuccessResponse(suppliers, "Suppliers retrieved successfully.");
            return Ok(successResponse);
        }
        catch (Exception ex)
        {
            var errorResponse = CommonResponse<IEnumerable<SupplierDto>>.ErrorResponse("An error occurred while retrieving suppliers.", new List<string> { ex.Message });
            return StatusCode(500, errorResponse);
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var supplier = await _supplierService.GetByIdAsync(id);
            if (supplier == null)
            {
                var errorResponse = CommonResponse<SupplierDto>.ErrorResponse($"Supplier with ID {id} not found.");
                return NotFound(errorResponse);
            }

            var successResponse = CommonResponse<SupplierDto>.SuccessResponse(supplier, "Supplier retrieved successfully.");
            return Ok(successResponse);
        }
        catch (Exception ex)
        {
            var errorResponse = CommonResponse<SupplierDto>.ErrorResponse("An error occurred while retrieving the supplier.", new List<string> { ex.Message });
            return StatusCode(500, errorResponse);
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] SupplierCreateDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                var errorResponse = CommonResponse<SupplierCreateDto>.ErrorResponse("Validation failed.", errors);
                return BadRequest(errorResponse);
            }

            var id = await _supplierService.CreateAsync(dto);
            var successResponse = CommonResponse<int>.SuccessResponse(id, "Supplier created successfully.");
            return CreatedAtAction(nameof(GetById), new { id }, successResponse);
        }
        catch (Exception ex)
        {
            var errorResponse = CommonResponse<SupplierCreateDto>.ErrorResponse("An error occurred while creating the supplier.", new List<string> { ex.Message });
            return StatusCode(500, errorResponse);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] SupplierCreateDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                var errorResponse = CommonResponse<SupplierCreateDto>.ErrorResponse("Validation failed.", errors);
                return BadRequest(errorResponse);
            }

            var result = await _supplierService.UpdateAsync(id, dto);
            if (result == 0)
            {
                var errorResponse = CommonResponse<SupplierCreateDto>.ErrorResponse($"Supplier with ID {id} not found.");
                return NotFound(errorResponse);
            }

            var successResponse = CommonResponse<int>.SuccessResponse(result, "Supplier updated successfully.");
            return Ok(successResponse);
        }
        catch (Exception ex)
        {
            var errorResponse = CommonResponse<SupplierCreateDto>.ErrorResponse("An error occurred while updating the supplier.", new List<string> { ex.Message });
            return StatusCode(500, errorResponse);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = await _supplierService.DeleteAsync(id);
            if (result == 0)
            {
                var errorResponse = CommonResponse<int>.ErrorResponse($"Supplier with ID {id} not found.");
                return NotFound(errorResponse);
            }

            var successResponse = CommonResponse<int>.SuccessResponse(result, "Supplier deleted successfully.");
            return Ok(successResponse);
        }
        catch (Exception ex)
        {
            var errorResponse = CommonResponse<int>.ErrorResponse("An error occurred while deleting the supplier.", new List<string> { ex.Message });
            return StatusCode(500, errorResponse);
        }
    }
}