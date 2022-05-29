using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BookStore.Models.Data;

namespace BookStore.Models.ViewModels
{
    public class OrderDetailsModel
    {
        public OrderDetailsModel()
        {

        }

        public OrderDetailsModel(OrderDetails orderDetails)
        {
            this.Id = orderDetails.Id;
            this.OrderMasterId = orderDetails.OrderMasterId;
            this.BookId = orderDetails.BookId;
            this.Quantity = orderDetails.Quantity;
            this.Price = orderDetails.Price;
            this.TotalPrice = orderDetails.TotalPrice;
        }
        public int Id { get; set; }
        public int OrderMasterId { get; set; }
        public int BookId { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
        public double TotalPrice { get; set; }

        public SubOrder ToEntity()
        {
            return new SubOrder
            {
                BookId = this.BookId,
                Quantity = this.Quantity,
                Price = this.Price,
                TotalPrice = this.TotalPrice
            };
        }
    }
}
