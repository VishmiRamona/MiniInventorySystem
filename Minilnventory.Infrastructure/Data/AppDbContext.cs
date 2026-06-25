using Microsoft.EntityFrameworkCore;
using MiniInventory.Domain.Entities;

namespace MiniInventory.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Category> Categories { get; set; } = null!;
    public DbSet<Supplier> Suppliers { get; set; } = null!;
    public DbSet<Item> Items { get; set; } = null!;
    public DbSet<StockIn> StockIns { get; set; } = null!;
    public DbSet<StockOut> StockOuts { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Category
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId);
            entity.Property(e => e.CategoryName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.CreatedDate).HasDefaultValueSql("GETDATE()");
        });

        // Configure Supplier
        modelBuilder.Entity<Supplier>(entity =>
        {
            entity.HasKey(e => e.SupplierId);
            entity.Property(e => e.SupplierName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.ContactNumber).HasMaxLength(20);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.CreatedDate).HasDefaultValueSql("GETDATE()");
        });

        // Configure Item
        modelBuilder.Entity<Item>(entity =>
        {
            entity.HasKey(e => e.ItemId);
            entity.Property(e => e.ItemCode).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Barcode).HasMaxLength(50);
            entity.Property(e => e.ItemName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.CostPrice).HasColumnType("decimal(18,2)");
            entity.Property(e => e.SellingPrice).HasColumnType("decimal(18,2)");
            entity.Property(e => e.ReorderLevel).HasDefaultValue(0);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.CreatedDate).HasDefaultValueSql("GETDATE()");

            // Relationships (Without Navigation Properties)
            entity.HasOne<Category>()
                .WithMany()
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne<Supplier>()
                .WithMany()
                .HasForeignKey(e => e.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes
            entity.HasIndex(e => e.ItemCode);
            entity.HasIndex(e => e.Barcode);
            entity.HasIndex(e => e.ItemName);
            entity.HasIndex(e => e.CategoryId);
            entity.HasIndex(e => e.SupplierId);
        });

        // Configure StockIn
        modelBuilder.Entity<StockIn>(entity =>
        {
            entity.HasKey(e => e.StockInId);
            entity.Property(e => e.Quantity).IsRequired();
            entity.Property(e => e.CostPrice).HasColumnType("decimal(18,2)");
            entity.Property(e => e.StockInDate).HasDefaultValueSql("GETDATE()");
            entity.Property(e => e.CreatedDate).HasDefaultValueSql("GETDATE()");

            // Relationships (Without Navigation Properties)
            entity.HasOne<Item>()
                .WithMany()
                .HasForeignKey(e => e.ItemId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne<Supplier>()
                .WithMany()
                .HasForeignKey(e => e.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure StockOut
        modelBuilder.Entity<StockOut>(entity =>
        {
            entity.HasKey(e => e.StockOutId);
            entity.Property(e => e.Quantity).IsRequired();
            entity.Property(e => e.Reason).IsRequired().HasMaxLength(50);
            entity.Property(e => e.StockOutDate).HasDefaultValueSql("GETDATE()");
            entity.Property(e => e.CreatedDate).HasDefaultValueSql("GETDATE()");

            // Relationships (Without Navigation Properties)
            entity.HasOne<Item>()
                .WithMany()
                .HasForeignKey(e => e.ItemId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}