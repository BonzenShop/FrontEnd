import { Pipe, PipeTransform } from '@angular/core';
import { Item } from '../_models/item';

@Pipe({
    name: 'itemCategory',
    pure: false
})
export class ItemCategoryFilterPipe implements PipeTransform {
    transform(items: Item[], filter: String[]): any {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        if(filter.length == 0){
            return items;
        }else{
            return items.filter(item => filter.some(el => el == item.category));
        }
    }
}