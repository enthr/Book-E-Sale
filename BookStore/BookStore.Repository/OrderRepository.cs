using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BookStore.Models;
using BookStore.Models.Data;
using BookStore.Models.ViewModels;

namespace BookStore.Repository
{
    public class OrderRepository
    {
        public BaseList<GetOrder> GetAll(int pageIndex, int pageSize, int userId)
        {
            GetOrder order = null;
            List<GetOrder> orders = new List<GetOrder>();
            List<GetSubOrder> subOrders = null;
            List<OrderMaster> orderMasters = null;
            List<OrderDetails> orderDetails = null;
            BaseList<GetOrder> result = new BaseList<GetOrder>();
            using (UnitOfWork db = new UnitOfWork())
            {
                orderMasters = db.OrderMasters.Where(order => (order.UserId == userId)).Skip((pageIndex - 1) * pageSize).Take(pageSize).AsQueryable().ToList();

                foreach (OrderMaster orderMaster in orderMasters)
                {
                    order = new GetOrder();
                    order.Id = orderMaster.Id;
                    order.UserId = orderMaster.UserId;
                    order.OrderDate = orderMaster.OrderDate;
                    order.TotalPrice = orderMaster.TotalPrice;
                    orderDetails = db.OrderDetails.AsQueryable().Where(o => o.OrderMasterId == orderMaster.Id).ToList();

                    subOrders = new List<GetSubOrder>();
                    foreach (OrderDetails orderDetail in orderDetails)
                    {
                        GetSubOrder getSubOrder = new GetSubOrder();
                        Book book = db.Books.Where(b => b.Id == orderDetail.BookId).FirstOrDefault();

                        getSubOrder.Book = new BookModel(book);
                        getSubOrder.Quantity = orderDetail.Quantity;
                        getSubOrder.Price = orderDetail.Price;
                        getSubOrder.TotalPrice = orderDetail.TotalPrice;
                        subOrders.Add(getSubOrder);
                    }

                    order.subOrders = subOrders;
                    orders.Add(order);
                }
            }
            result.TotalRecords = orders.Count();
            result.Records = orders;
            return result;
        }

        public Order Add(Order order)
        {
            using (UnitOfWork db = new UnitOfWork())
            {
                OrderMaster orderMaster = new OrderMaster();
                orderMaster.UserId = order.UserId;
                orderMaster.OrderDate = order.OrderDate;
                orderMaster.TotalPrice = order.TotalPrice;

                db.OrderMasters.Add(orderMaster);
                db.SaveChanges();

                OrderDetails orderDetails = null;
                Book book = null;
                foreach (SubOrder subOrder in order.subOrders)
                {
                    book = db.Books.Where(b => b.Id == subOrder.BookId).FirstOrDefault();
                    orderDetails = new OrderDetails();
                    orderDetails.OrderMasterId = orderMaster.Id;
                    orderDetails.BookId = subOrder.BookId;
                    orderDetails.Quantity = subOrder.Quantity;
                    orderDetails.Price = subOrder.Price;
                    orderDetails.TotalPrice = subOrder.TotalPrice;
                    db.OrderDetails.Add(orderDetails);
                    db.SaveChanges();

                    book.Quantity = book.Quantity - orderDetails.Quantity;
                    db.Books.Update(book);
                    db.SaveChanges();
                }
                return order;
            }
        }
    }
}
