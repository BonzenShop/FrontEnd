import { SafeResourceUrl } from '@angular/platform-browser';

export class Item {
    id: number;
    name: string;
    desc: string;
    category: string;
    price: number;
    onStock: number;
    image: number;
    imagePath?: SafeResourceUrl
}