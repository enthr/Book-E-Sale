using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using BookStore.Models;
using BookStore.Models.Data;
using BookStore.Models.ViewModels;
using BookStore.Repository;

namespace BookStore.API.Controllers
{
    [Route("api/Order")]
    [ApiController]
    public class OrderController : Controller
    {
        [HttpGet]
        [Route("list")]
        public BaseList<GetOrderModel> GetOrders(int pageIndex = 1, int pageSize = 10, int userId = 0)
        {
            OrderRepository repo = new OrderRepository();
            BaseList<GetOrder> order = repo.GetAll(pageIndex, pageSize, userId);
            return new BaseList<GetOrderModel> { TotalRecords = order.TotalRecords, Records = order.Records.Select(record => new GetOrderModel(record)).ToList() };
        }

        [HttpPost]
        [Route("Add")]
        public OrderModel AddOrder(OrderModel order)
        {
            OrderRepository repo = new OrderRepository();
            return new OrderModel(repo.Add(order.ToEntity()));
        }
    }
}
