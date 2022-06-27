using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Video : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }

        public string? VideoUrl { get; set; }

        public Product Product { get; set; }
        public int ProductId { get; set; }

    }
}