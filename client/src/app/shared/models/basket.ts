import {v4 as uuidv4} from 'uuid';

export interface IBasket {
    id: string
    items: IBasketItem[]
    clientSecret?: string
    paymentIntentId?: string
    
  }
  
  export interface IBasketItem {
    id: number
    productName: string
    price: number
    quantity: number
    pictureUrl: string
    brand: string
    type: string
  }

  export class Basket implements IBasket
  {
      id = uuidv4();
      items: IBasketItem[] = [];
      
  }


  export interface IBasketTotals {
    subtotal: number,
    total: number
  }