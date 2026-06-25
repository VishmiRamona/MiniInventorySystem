using FluentValidation;
using MiniInventory.Application.DTOs;

namespace MiniInventory.Application.Validators;

public class SupplierValidator : AbstractValidator<SupplierCreateDto>
{
    public SupplierValidator()
    {
        RuleFor(x => x.SupplierName)
            .NotEmpty().WithMessage("Supplier Name is required.")
            .MaximumLength(100).WithMessage("Supplier Name must not exceed 100 characters.");

        RuleFor(x => x.Email)
            .EmailAddress().WithMessage("Invalid email format.")
            .When(x => !string.IsNullOrEmpty(x.Email));
    }
}