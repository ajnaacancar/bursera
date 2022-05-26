using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities.OrderAggregate
{
    public class ProductItemOrdered
    {
        public ProductItemOrdered()
        {
        }

        public ProductItemOrdered(int productItemId, string porductName, string pictureUrl)
        {
            ProductItemId = productItemId;
            PorductName = porductName;
            PictureUrl = pictureUrl;
        }

        public int ProductItemId { get; set; }
        public string PorductName { get; set; }
        public string PictureUrl { get; set; }
    }

}