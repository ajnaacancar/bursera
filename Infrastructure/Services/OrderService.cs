using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IBasketRepository _basketRepository;
        private readonly IUnitOfWork _unitOfWork;
        public OrderService(IUnitOfWork unitOfWork, IBasketRepository basketRepository )
        {
            _unitOfWork = unitOfWork;
            _basketRepository = basketRepository;
            
        }

        public async Task<Order> CreateOrderAsync(string buyerEmail, string basketId, Address address)
        {
           // get basket from the repo
           var basket = await _basketRepository.GetBasketAsync(basketId);
           //get items from product repo
           var items = new List<OrderItem>();
           foreach(var item in basket.Items){
               var productItem = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Id);
               var itemOrder = new ProductItemOrdered(productItem.Id, productItem.Name, productItem.PictureUrl);
               var orderItem = new OrderItem(itemOrder, productItem.Price, item.Quantity);

               items.Add(orderItem);
           }
           //calculate prices
           var subtotal = items.Sum(item => item.Price * item.Quantity);
           // create order
           var order = new Order(buyerEmail, address, items, subtotal);
           //  save to database

           _unitOfWork.Repository<Order>().Add(order);
           var result = await _unitOfWork.Complete();

           if(result <= 0){
               return null;
           }

           // delete basket

           await _basketRepository.DeleteBasketAsync(basketId);

           //return order
           return order;
        }

        public async Task<Order> GetOrderById(int id, string buyerEmail)
        {
           var spec = new OrdersWithItemsAndOrderingSpecification(id, buyerEmail);

           return await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
           var spec = new OrdersWithItemsAndOrderingSpecification(buyerEmail);

           return await _unitOfWork.Repository<Order>().ListAsync(spec);
        }
    }
}