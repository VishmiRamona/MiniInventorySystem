using Microsoft.AspNetCore.Mvc;
using MiniInventory.Application.DTOs;
using MiniInventory.Application.Interfaces;
using MiniInventory.Shared;

namespace MiniInventory.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var users = await _userService.GetAllAsync();
            var response = CommonResponse<IEnumerable<UserDto>>.SuccessResponse(users, "Users retrieved successfully.");
            return Ok(response);
        }
        catch (Exception ex)
        {
            var response = CommonResponse<IEnumerable<UserDto>>.ErrorResponse("An error occurred.", new List<string> { ex.Message });
            return StatusCode(500, response);
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null)
                return NotFound(CommonResponse<UserDto>.ErrorResponse($"User with ID {id} not found."));

            var response = CommonResponse<UserDto>.SuccessResponse(user, "User retrieved successfully.");
            return Ok(response);
        }
        catch (Exception ex)
        {
            var response = CommonResponse<UserDto>.ErrorResponse("An error occurred.", new List<string> { ex.Message });
            return StatusCode(500, response);
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UserCreateDto dto)
    {
        try
        {
            var id = await _userService.CreateAsync(dto);
            var response = CommonResponse<int>.SuccessResponse(id, "User created successfully.");
            return CreatedAtAction(nameof(GetById), new { id }, response);
        }
        catch (Exception ex)
        {
            var response = CommonResponse<int>.ErrorResponse("An error occurred.", new List<string> { ex.Message });
            return StatusCode(500, response);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UserCreateDto dto)
    {
        try
        {
            var result = await _userService.UpdateAsync(id, dto);
            if (result == 0)
                return NotFound(CommonResponse<int>.ErrorResponse($"User with ID {id} not found."));

            var response = CommonResponse<int>.SuccessResponse(result, "User updated successfully.");
            return Ok(response);
        }
        catch (Exception ex)
        {
            var response = CommonResponse<int>.ErrorResponse("An error occurred.", new List<string> { ex.Message });
            return StatusCode(500, response);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = await _userService.DeleteAsync(id);
            if (result == 0)
                return NotFound(CommonResponse<int>.ErrorResponse($"User with ID {id} not found."));

            var response = CommonResponse<int>.SuccessResponse(result, "User deleted successfully.");
            return Ok(response);
        }
        catch (Exception ex)
        {
            var response = CommonResponse<int>.ErrorResponse("An error occurred.", new List<string> { ex.Message });
            return StatusCode(500, response);
        }
    }
}