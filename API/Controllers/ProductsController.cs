using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using API.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {        
        private readonly IGenericRepository<Product> _productsRepo;
        private readonly IGenericRepository<ProductBrand> _productBrandRepos;
        private readonly IGenericRepository<ProductType> _productTypeRepo;
        private readonly IGenericRepository<Video> _videoRepo;
        private readonly IMapper _mapper;
        public ProductsController(
            IGenericRepository<Product> productsRepo, 
            IGenericRepository<ProductBrand> productBrandRepos, 
            IGenericRepository<ProductType> productTypeRepo,
            IGenericRepository<Video> videoRepo,
            IMapper mapper
            )
        {
            _productBrandRepos = productBrandRepos;
            _productsRepo = productsRepo;
            _productTypeRepo = productTypeRepo;
            _videoRepo = videoRepo;
            _mapper = mapper;
          
  

        }

        [HttpGet]
        public async Task<ActionResult<Pagination<ProductDto>>> getProducts([FromQuery]ProductSpecParams productParams)
        {   
            var spec = new ProductsSpecifications(productParams);

            var  countSpec = new ProductWithFiltersForCountSpec(productParams);

            var totalItems = await _productsRepo.CountAsync(countSpec);
           var products = await _productsRepo.ListAsync(spec);
           var data = _mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductDto>>(products);
           return Ok(new Pagination<ProductDto>(productParams.PageIndex, productParams.PageSize, totalItems, data));
        }

         [HttpGet("{id}")]
         [ProducesResponseType(StatusCodes.Status200OK)]
          [ProducesResponseType(typeof(ApiResponse),  StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductDto>> getProduct(int id){
            var spec =  new ProductsSpecifications(id);

            var product = await _productsRepo.GetEntityWithSpec(spec);

            if(product == null){
                return NotFound(new ApiResponse(404));
            }

            return _mapper.Map<Product, ProductDto>(product);
        }

        [HttpGet("brands")]
         public async Task<ActionResult<IReadOnlyList<ProductBrand>>> getProductBrands()
        {   
           return Ok(await _productBrandRepos.ListAllAsync());
        }
        
        [HttpGet("types")]
         public async Task<ActionResult<IReadOnlyList<ProductType>>> getProductTypes()
        {   
           return Ok(await _productTypeRepo.ListAllAsync());
        }

          [HttpGet("videos/{productId}")]
         public async Task<ActionResult<IReadOnlyList<Video>>> getVideos(int productId)
        {   
           var  spec = new VideoSpecification(productId);
           return Ok(await _videoRepo.ListAllAsyncById(spec));
        }
    }
}