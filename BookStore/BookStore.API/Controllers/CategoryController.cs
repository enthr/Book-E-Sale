using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BookStore.Models;
using BookStore.Models.Data;
using BookStore.Models.ViewModels;
using BookStore.Repository;


namespace BookStore.API.Controllers
{
    [Route("api/Category")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        [HttpGet]
        [Route("list")]
        public BaseList<CategoryModel> GetCategories(int pageIndex = 1, int pageSize = 10)
        {
            CategoryRepository repo = new CategoryRepository();
            BaseList<Category> categories = repo.GetAll(pageIndex, pageSize);
            return new BaseList<CategoryModel> { TotalRecords = categories.TotalRecords, Records = categories.Records.Select(record => new CategoryModel(record)).ToList() };
        }

        [HttpGet]
        [Route("{id}")]
        public CategoryModel GetCategory([FromRoute] int id)
        {
            CategoryRepository repo = new CategoryRepository();
            return new CategoryModel(repo.GetById(id));
        }

        [HttpPost]
        [Route("Add")]
        public CategoryModel AddCategory(CategoryModel category)
        {
            CategoryRepository repo = new CategoryRepository();
            return new CategoryModel(repo.Add(category.ToEntity()));
        }

        [HttpPut]
        [Route("Update")]
        public CategoryModel UpdateCategory(CategoryModel category)
        {
            CategoryRepository repo = new CategoryRepository();
            return new CategoryModel(repo.Update(category.ToEntity()));
        }

        [HttpDelete]
        [Route("Delete/{id}")]
        public CategoryModel DeleteCategory([FromRoute] int id)
        {
            CategoryRepository repo = new CategoryRepository();
            return new CategoryModel(repo.Delete(id));
        }
    }
}
