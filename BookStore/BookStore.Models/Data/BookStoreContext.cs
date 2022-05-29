using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;


namespace BookStore.Models.Data
{
    public partial class BookStoreContext: DbContext
    {
        public BookStoreContext()
        {
        }

        public BookStoreContext(DbContextOptions<BookStoreContext> options): base(options)
        {
        }

        public virtual DbSet<Book> Books { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Cart> Carts { get; set; }
        public virtual DbSet<OrderMaster> OrderMasters { get; set; }
        public virtual DbSet<OrderDetails> OrderDetails { get; set; }
        public virtual DbSet<Publisher> Publishers { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "English_India.1252");

            modelBuilder.Entity<Book>(entity =>
            {
                entity.ToTable("book");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("nextval('books_id_seq'::regclass)");

                entity.Property(e => e.Base64image).HasColumnName("base64image");

                entity.Property(e => e.Categoryid).HasColumnName("categoryid");

                entity.Property(e => e.Description)
                    .HasMaxLength(2000)
                    .HasColumnName("description");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(500)
                    .HasColumnName("name");

                entity.Property(e => e.Price)
                    .HasPrecision(10, 2)
                    .HasColumnName("price");

                entity.Property(b => b.PublisherId).HasColumnName("publisherid");

                entity.Property(q => q.Quantity)
                    .HasColumnName("quantity");

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.Books)
                    .HasForeignKey(d => d.Categoryid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_category");

                entity.HasOne(b => b.Publisher)
                    .WithMany(b => b.Books)
                    .HasForeignKey(b => b.PublisherId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_publisher");
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.ToTable("category");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("nextval('categories_id_seq'::regclass)");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("name");
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.ToTable("role");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("nextval('roles_id_seq'::regclass)");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("name");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("user");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("nextval('users_id_seq'::regclass)");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("email");

                entity.Property(e => e.Firstname)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("firstname");

                entity.Property(e => e.Lastname)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("lastname");

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("password");

                entity.Property(e => e.Roleid).HasColumnName("roleid");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.Users)
                    .HasForeignKey(d => d.Roleid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_role");
            });

            modelBuilder.Entity<Cart>(entity =>
            {
                entity.ToTable("cart");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("nextval('cart_id_seq'::regclass)");

                entity.Property(e => e.BookId)
                    .IsRequired()
                    .HasColumnName("bookid");

                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("userid");

                entity.Property(e => e.Quantity)
                    .IsRequired()
                    .HasColumnName("quantity");

                entity.HasOne(c => c.Book)
                    .WithMany(c => c.Carts)
                    .HasForeignKey(c => c.BookId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_book");

                entity.HasOne(c => c.User)
                    .WithMany(c => c.Carts)
                    .HasForeignKey(c => c.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_user");
            });

            modelBuilder.Entity<OrderMaster>(entity => {
                entity.ToTable("ordermaster");
                entity.Property(e => e.Id)
                        .HasColumnName("id")
                        .HasDefaultValueSql("nextval('ordermst_id_seq'::regclass)");

                entity.Property(u => u.UserId)
                    .HasColumnName("userid");

                entity.Property(od => od.OrderDate).HasColumnName("orderdate");

                entity.Property(o => o.TotalPrice).HasColumnName("totalprice");

                entity.HasOne(u => u.User)
                   .WithMany(o => o.OrderMsts)
                   .HasForeignKey(u => u.UserId)
                   .OnDelete(DeleteBehavior.ClientSetNull)
                   .HasConstraintName("fk_user");
            });

            modelBuilder.Entity<OrderDetails>(entity => {
                entity.ToTable("orderdetails");

                entity.Property(i => i.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("nextval('orderdtl_id_seq::regclass')");

                entity.Property(o => o.OrderMasterId).HasColumnName("ordermasterid");

                entity.Property(b => b.BookId).HasColumnName("bookid");

                entity.Property(q => q.Quantity).HasColumnName("quantity");

                entity.Property(q => q.Price).HasColumnName("price");

                entity.Property(tp => tp.TotalPrice).HasColumnName("totalprice");
            });

            modelBuilder.Entity<Publisher>(entity => {
                entity.ToTable("publisher");

                entity.Property(p => p.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("nextval('publisher_id_seq::regclass')");

                entity.Property(p => p.Name).HasColumnName("name");

                entity.Property(p => p.Address).HasColumnName("address");

                entity.Property(p => p.Contact).HasColumnName("contact");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }

}
