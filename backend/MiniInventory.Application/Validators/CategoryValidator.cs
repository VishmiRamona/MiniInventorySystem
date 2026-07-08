using FluentValidation;
using MiniInventory.Application.DTOs;

namespace MiniInventory.Application.Validators;

public class CategoryValidator : AbstractValidator<CategoryCreateDto>
{
    public CategoryValidator()
    {
        RuleFor(x => x.CategoryName)
            .NotEmpty().WithMessage("Category Name is required.")
            .MaximumLength(100).WithMessage("Category Name must not exceed 100 characters.");
    }
}