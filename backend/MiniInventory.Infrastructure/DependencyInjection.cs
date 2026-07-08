using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using MiniInventory.Application.Interfaces;
using MiniInventory.Application.Services;
using MiniInventory.Infrastructure.Data;
using MiniInventory.Infrastructure.Repositories;

namespace MiniInventory.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        string connectionString)
    {
        // Register DbContext
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(connectionString));

        // Register Repositories
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<ISupplierRepository, SupplierRepository>();
        services.AddScoped<IItemRepository, ItemRepository>();
        services.AddScoped<IStockInRepository, StockInRepository>();
        services.AddScoped<IStockOutRepository, StockOutRepository>();

        // Register Services
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<ISupplierService, SupplierService>();
        services.AddScoped<IItemService, ItemService>();
        services.AddScoped<IStockService, StockService>();
        services.AddScoped<IUserService, Services.UserService>();

        return services;
    }
}