using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookStore.Models.Data
{
    public partial class OrderDetails
    {
        public int Id { get; set; }
        public int OrderMasterId { get; set; }
        public int BookId { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
        public double TotalPrice { get; set; }

        public virtual OrderMaster OrderMaster { get; set; }
        public virtual Book Book { get; set; }
    }
}
