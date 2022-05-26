using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Core.Entities.OrderAggregate;
using API.Dtos;
using AutoMapper;
using System.Security.Claims;
using API.Extensions;
using API.Errors;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly IOrderService _orderService;
        private readonly IMapper _mapper;
        public OrdersController(IOrderService orderService, IMapper mapper)
        {
            _mapper = mapper;
            _orderService = orderService;
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrdder(OrderDto orderDto){
            var email = HttpContext.User.RetriveEmailFromPrinciple();
            var address = _mapper.Map<AddressDto, Address>(orderDto.Address);

            var order = await _orderService.CreateOrderAsync(email, orderDto.BasketId , address);

            if(order == null){
                return BadRequest(new ApiResponse(400, "Problem creating order"));
            }

            return Ok(order);
            
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<OrderToReturnDto>>> GetOrdersForUser(){
            var email = HttpContext.User.RetriveEmailFromPrinciple();

            var orders = await _orderService.GetOrdersForUserAsync(email);

            return Ok(_mapper.Map<IReadOnlyList<Order>, IReadOnlyList<OrderToReturnDto>>(orders));
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<OrderToReturnDto>> GetOrderById(int id){
            var email = HttpContext.User.RetriveEmailFromPrinciple();

            var order = await _orderService.GetOrderById(id, email);
            if(order == null){
                return NotFound(new ApiResponse(404));
            }

            return _mapper.Map<Order, OrderToReturnDto>(order);
        }
    }
}