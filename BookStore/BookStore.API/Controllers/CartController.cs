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
    [Route("api/Cart")]
    [ApiController]
    public class CartController : ControllerBase
    {
        [HttpGet]
        [Route("list")]
        public BaseList<GetCartModel> GetCartItems(int pageIndex = 1, int pageSize = 10, int UserId = 0)
        {
            CartRepository repo = new CartRepository();
            BaseList<GetCartModel> cart = repo.GetAll(pageIndex, pageSize, UserId);
            return cart;
        }

        [HttpPost]
        [Route("Add")]
        public CartModel AddToCart(CartModel cart)
        {
            CartRepository repo = new CartRepository();
            return new CartModel(repo.AddToCart(cart.ToEntity()));
        }

        [HttpPut]
        [Route("Update")]
        public CartModel UpdateCart(CartModel cart)
        {
            CartRepository repo = new CartRepository();
            return new CartModel(repo.UpdateCart(cart.ToEntity()));
        }

        [HttpDelete]
        public CartModel RemoveCartItem(int id)
        {
            CartRepository repo = new CartRepository();
            return new CartModel(repo.DeleteItem(id));
        }
    }
}
