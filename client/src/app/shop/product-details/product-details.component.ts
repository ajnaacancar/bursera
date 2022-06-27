import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { BasketService } from 'src/app/basket/basket.service';
import { OrdersService } from 'src/app/orders/orders.service';
import { IOrder } from 'src/app/shared/models/order';
import { IProduct } from 'src/app/shared/models/product';
import { IUser } from 'src/app/shared/models/user';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct;
  quantity: number = 1;
  currentUser$: Observable<IUser>
  orders: IOrder[];
  isOrdered = false;


  constructor(private shopService: ShopService, private activatedRoute: ActivatedRoute, private bcService: BreadcrumbService, private basketService: BasketService, private accountService: AccountService, private orderService: OrdersService) { 
    this.bcService.set('@productDetails', ' ')
  }

  ngOnInit(): void {
    this.currentUser$ = this.accountService.currentUser$;
    this.loadProduct()
    this.getOrders()
  }

  addItemToBasket(){
    this.basketService.addItemToBasket(this.product, this.quantity);
  }

  incrementQuantity(){
    this.quantity++;
  }

  decdrmentQuantity(){
    if(this.quantity>1){
    this.quantity--;
    }
  }

  loadProduct(){
    this.shopService.getProduct(+this.activatedRoute.snapshot.paramMap.get('id')).subscribe(product => {
      this.product = product;
      this.bcService.set('@productDetails', product.name)
    }, error => {
          console.log(error);
    })
  }

  getOrders() {
    this.orderService.getOrdersForUser().subscribe((orders: IOrder[]) => {
      this.orders = orders;
      this.orders.forEach(order =>{
      const findProduct =  order.orderItems.find(product => product.productId == this.product.id)
      if(findProduct){
        this.isOrdered = true;
      }
      })
    }, error => {
      console.log(error);
    })
  }
}
