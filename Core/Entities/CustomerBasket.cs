using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Core.Entities
{
    public class CustomerBasket
    {
         public CustomerBasket()
        {
        }

        public CustomerBasket(string id)
        {
            Id = id;
        }

        [Required]
        public string Id { get; set; }
        public List<BasketItem> Items  { get; set; } = new List<BasketItem>();

        public string ClientSecret { get; set; }

        public string PaymentIntentId { get; set; }
    }
}