import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import {map} from 'rxjs/operators'
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket>(null);
  basket$ = this.basketSource.asObservable();
  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null)
  basketTotal$ = this.basketTotalSource.asObservable();

  constructor(private http: HttpClient) { }

  createPaymentIntent(){
    return this.http.post(this.baseUrl + 'payments/' + this.getCurrentBasketValue().id, {})
            .pipe(
              map((basket: IBasket) =>{
                this.basketSource.next(basket)
              })
            )

  }

  getBasket(id: string){
    return this.http.get(this.baseUrl + 'basket?id='+id).pipe(
      map((basket: IBasket) => {
          this.basketSource.next(basket)
          this.calculatedTotals();
      })
    )
  }


  setBasket(basket: IBasket){
    return this.http.post(this.baseUrl + 'basket', basket).subscribe((response: IBasket) => {
      this.basketSource.next(response);
      this.calculatedTotals();
    }, error => {
      console.log(error)
    })
  }


  getCurrentBasketValue(){
    return this.basketSource.value;
  }

  icrementItemQuantity(item: IBasketItem){
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    basket.items[foundItemIndex].quantity++;
    this.setBasket(basket);
  }

  decrementItemQuantity(item: IBasketItem){
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    if(basket.items[foundItemIndex].quantity > 1){
      basket.items[foundItemIndex].quantity--;
      this.setBasket(basket);
    }else{
      this.removeItemFromBasket(item);
    }
    this.setBasket(basket);
  }

  removeItemFromBasket(item: IBasketItem){
    const basket = this.getCurrentBasketValue();
    if(basket.items.some(x=>x.id === item.id)){
      basket.items = basket.items.filter(i => i.id !== item.id)
      if(basket.items.length >0){
        this.setBasket(basket);
      }else{
        this.deleteBasket(basket);
      }
    };
   
  }

  deleteLocalBasket(id: string){
    this.basketSource.next(null)
    this.basketTotalSource.next(null)
    localStorage.removeItem('basket_id')
  }

  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe(() =>{
      this.basketSource.next(null);
      localStorage.removeItem('basket_id');
    },error =>{
      console.log(error);
    });
  }

  addItemToBasket(item: IProduct, quantity = 1){
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
    const basket = this.getCurrentBasketValue() ?? this.createBasket()
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
    this.setBasket(basket)
  }
 private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
     
  const index = items.findIndex(i => i.id === itemToAdd.id);

      if(index === -1){
        itemToAdd.quantity = quantity;
        items.push(itemToAdd)
      }else{
        items[index].quantity += quantity;
      }

      return items;
  }
  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }
 private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType
    }
  }

   calculatedTotals(){
    const basket = this.getCurrentBasketValue();
    const subtotal = basket.items.reduce((a,b) => (b.price * b.quantity) + a, 0);
    const total = subtotal;
    this.basketTotalSource.next({total, subtotal});
    return total;
  }
}