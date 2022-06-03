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
    [Route("api/Book")]
    [ApiController]
    public class BookController : ControllerBase
    {
        [HttpGet]
        [Route("list")]
        public BaseList<GetBookModel> GetBooks(int pageIndex = 1, int pageSize = 10)
        {
            BookRepository repo = new BookRepository();
            BaseList<GetBookModel> books = repo.GetAll(pageIndex, pageSize);
            return books;
        }

        [HttpGet]
        [Route("{id}")]
        public GetBookModel GetBook([FromRoute] int id)
        {
            BookRepository repo = new BookRepository();
            return repo.GetBookModelById(id);
        }

        [HttpPost]
        [Route("Add")]
        public BookModel AddBook(BookModel book)
        {
            BookRepository repo = new BookRepository();
            return new BookModel(repo.Add(book.ToEntity()));
        }

        [HttpPut]
        [Route("Update")]
        public BookModel UpdateBook(BookModel book)
        {
            BookRepository repo = new BookRepository();
            return new BookModel(repo.Update(book.ToEntity()));
        }

        [HttpDelete]
        [Route("Delete/{id}")]
        public BookModel DeleteBook([FromRoute] int id)
        {
            BookRepository repo = new BookRepository();
            return new BookModel(repo.Delete(id));
        }
    }
}
