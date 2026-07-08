using FluentValidation;
using MiniInventory.Application.DTOs;

namespace MiniInventory.Application.Validators;

public class StockInValidator : AbstractValidator<StockInCreateDto>
{
    public StockInValidator()
    {
        RuleFor(x => x.ItemId)
            .GreaterThan(0).WithMessage("Item is required.");

        RuleFor(x => x.SupplierId)
            .GreaterThan(0).WithMessage("Supplier is required.");

        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Quantity must be greater than 0.");

        RuleFor(x => x.CostPrice)
            .GreaterThan(0).WithMessage("Cost Price must be greater than 0.");
    }
}