using FluentValidation;
using MiniInventory.Application.DTOs;

namespace MiniInventory.Application.Validators;

public class ItemValidator : AbstractValidator<ItemCreateDto>
{
    public ItemValidator()
    {
        RuleFor(x => x.ItemCode)
            .NotEmpty().WithMessage("Item Code is required.")
            .MaximumLength(50).WithMessage("Item Code must not exceed 50 characters.");

        RuleFor(x => x.ItemName)
            .NotEmpty().WithMessage("Item Name is required.")
            .MaximumLength(100).WithMessage("Item Name must not exceed 100 characters.");

        RuleFor(x => x.CategoryId)
            .GreaterThan(0).WithMessage("Category is required.");

        RuleFor(x => x.SupplierId)
            .GreaterThan(0).WithMessage("Supplier is required.");

        RuleFor(x => x.CostPrice)
            .GreaterThan(0).WithMessage("Cost Price must be greater than 0.");

        RuleFor(x => x.SellingPrice)
            .GreaterThan(0).WithMessage("Selling Price must be greater than 0.");

        RuleFor(x => x.ReorderLevel)
            .GreaterThanOrEqualTo(0).WithMessage("Reorder Level cannot be negative.");
    }
}