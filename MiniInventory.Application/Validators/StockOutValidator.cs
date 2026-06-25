using FluentValidation;
using MiniInventory.Application.DTOs;

namespace MiniInventory.Application.Validators;

public class StockOutValidator : AbstractValidator<StockOutCreateDto>
{
    public StockOutValidator()
    {
        RuleFor(x => x.ItemId)
            .GreaterThan(0).WithMessage("Item is required.");

        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Quantity must be greater than 0.");

        RuleFor(x => x.Reason)
            .NotEmpty().WithMessage("Reason is required.")
            .MaximumLength(50).WithMessage("Reason must not exceed 50 characters.");
    }
}