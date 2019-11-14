import { Pipe, PipeTransform } from '@angular/core';
import { Item } from '../_models/item';

@Pipe({
    name: 'itemSearch',
    pure: false
})
export class ItemSearchFilterPipe implements PipeTransform {
    transform(items: Item[], searchText: string): any {
        var re = new RegExp(searchText, "i");
        if (!items || !searchText) {
            return items;
        }else{
            return items.filter(item => item.name.match(re) || item.desc.match(re));
        }
    }
}