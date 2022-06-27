using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Specifications
{
    public class VideoSpecification : BaseSpecification<Video>
    {
        public VideoSpecification(int productId) : base(v => v.ProductId == productId)
        {
             AddOrderBy(v => v.Name);
        }
    }
}