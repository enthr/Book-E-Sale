using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using BookStore.Models.Data;

namespace BookStore.Repository
{
    public class UnitOfWork : BookStoreContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {

            optionsBuilder.UseLazyLoadingProxies();
            if (!optionsBuilder.IsConfigured)
            {
                var builder1 = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("environmentSettings.json");
                string environment = builder1.Build().GetSection("ENVIRONMENT").GetSection("Key").Value;
                string connectionString = string.Empty;
                var builder = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json", optional: true).AddJsonFile($"appsettings.{environment}.json", optional: false);
                connectionString = builder.Build().GetSection("BookStorePostgreSqlConnectionString").GetSection("BookStoreApplicationDB").Value;

                if (!string.IsNullOrEmpty(connectionString))
                {
                    optionsBuilder.UseNpgsql(connectionString);
                }

            }
        }
    }
}
