using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BookStore.Models.Data;

namespace BookStore.Models.ViewModels
{
    public class UserModel
    {

        public UserModel()
        {

        }

        public UserModel(User user)
        {
            this.Id = user.Id;
            this.Email = user.Email;
            this.Password = user.Password;
            this.RoleId = user.Roleid;
            this.FirstName = user.Firstname;
            this.LastName = user.Lastname;
        }

        public int Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int RoleId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public User ToEntity()
        {
            return new User
            {
                Roleid = this.RoleId,
                Firstname = this.FirstName,
                Lastname = this.LastName,
                Password = this.Password,
                Email = this.Email,
                Id = this.Id
            };
        }
    }
}
