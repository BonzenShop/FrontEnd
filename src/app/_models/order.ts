import { SafeResourceUrl } from '@angular/platform-browser';

export class Order {
    id: number;
    user: number;
    orderDate: string;
    name: string;
    category: string;
    price: number;
    amount: number;
    totalPrice: number;
    image: number;
    imagePath?: SafeResourceUrl;
}