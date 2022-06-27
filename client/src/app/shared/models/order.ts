import { IAddress } from "./address";

export interface IOrderToCreate{
    basketId: string;
    address: IAddress;
}

export interface IOrderItem {
    productId: number;
    productName: string;
    pictureUrl: string;
    price: number;
    quantity: number;
}

export interface IOrder {
    id: number;
    buyerEmail: string;
    orderDate: Date;
    address: IAddress;
    orderItems: IOrderItem[];
    subtotal: number;
    total: number;
    status: string;
}
