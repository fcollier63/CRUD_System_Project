using crudSystemProject.Models;
using Microsoft.EntityFrameworkCore;

namespace crudSystemProject.DAL
{

    public class CompanyDbContext : DbContext
    {
        public CompanyDbContext(DbContextOptions options) : base(options)
        {

        }

        
        public DbSet<Address> Address { get; set; }
        public DbSet<Country> Country { get; set; } 
        public DbSet<Company> Company { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Configure your database connection here
            optionsBuilder.UseSqlServer("server=34.252.88.110;Database=Finn;Trusted_Connection=False;User=CMS_Owner;Password=CMS_Owner;MultipleActiveResultSets=true;Encrypt=false");
            optionsBuilder.EnableSensitiveDataLogging();
        }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Address>()
                .HasKey(a => a.AddressId);

            modelBuilder.Entity<Address>()
                .Property(a => a.AddressId)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Address>()
                .Property(a => a.StreetAddress1)
                .IsRequired();

            modelBuilder.Entity<Address>()
                .Property(a => a.StreetAddress2)
                .IsRequired();

            modelBuilder.Entity<Address>()
                .Property(a => a.Region)
                .IsRequired();

            modelBuilder.Entity<Address>()
                .Property(a => a.PostCode)
                .IsRequired();

            // =======================================
            // =======================================
            modelBuilder.Entity<Company>()
                .HasKey(c => c.CompanyId);

            modelBuilder.Entity<Company>()
                .Property(c => c.CompanyId)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Company>()
                .Property(c => c.CompanyName)
                .IsRequired();

            modelBuilder.Entity<Company>()
                .Property(c => c.PhoneNumber)
                .IsRequired();

            // =======================================
            // =======================================
            modelBuilder.Entity<Country>()
                .HasKey(c => c.CountryId);

            modelBuilder.Entity<Country>()
                .Property(c => c.CountryName)
                .IsRequired();

            // =======================================
            // =======================================
            modelBuilder.Entity<Address>()
                .HasOne(a => a.Country)
                .WithMany()
                .HasForeignKey(a => a.CountryId);


            modelBuilder.Entity<Address>()
                .HasOne(a => a.Company)  // A single address belongs to one company
                .WithMany(c => c.Addresses)  // A company can have multiple addresses
                .HasForeignKey(a => a.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);

        }





    }
}