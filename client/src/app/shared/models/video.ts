import { IProduct } from "./product";

export interface IVideo {
    id: number;
    name: string;
    description: string;
    videoUrl: string;
    product: IProduct;
    productId: number;
}