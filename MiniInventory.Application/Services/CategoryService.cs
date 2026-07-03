using MiniInventory.Application.DTOs;
using MiniInventory.Application.Interfaces;
using MiniInventory.Domain.Entities;

namespace MiniInventory.Application.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<IEnumerable<CategoryDto>> GetAllAsync()
    {
        var categories = await _categoryRepository.GetAllAsync();
        return categories.Select(c => new CategoryDto
        {
            CategoryId = c.CategoryId,
            CategoryName = c.CategoryName,
            Description = c.Description,
            IsActive = c.IsActive
        });
    }

    public async Task<CategoryDto?> GetByIdAsync(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        if (category == null) return null;

        return new CategoryDto
        {
            CategoryId = category.CategoryId,
            CategoryName = category.CategoryName,
            Description = category.Description,
            IsActive = category.IsActive
        };
    }

    public async Task<int> CreateAsync(CategoryCreateDto dto)
    {
        var category = new Category
        {
            CategoryName = dto.CategoryName ?? string.Empty,
            Description = dto.Description,
            IsActive = true,
            CreatedDate = DateTime.Now
        };

        return await _categoryRepository.CreateAsync(category);
    }

    public async Task<int> UpdateAsync(int id, CategoryCreateDto dto)
    {
        var existing = await _categoryRepository.GetByIdAsync(id);
        if (existing == null) return 0;

        existing.CategoryName = dto.CategoryName ?? string.Empty;
        existing.Description = dto.Description;

        return await _categoryRepository.UpdateAsync(existing);
    }

    public async Task<int> DeleteAsync(int id)
    {
        return await _categoryRepository.DeleteAsync(id);
    }
}