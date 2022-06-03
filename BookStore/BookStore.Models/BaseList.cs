using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookStore.Models
{
    public class BaseList<T> where T : class
    {
        public IEnumerable<T> Records { get; set; } = null!;
        public int TotalRecords { get; set; }
    }
}
