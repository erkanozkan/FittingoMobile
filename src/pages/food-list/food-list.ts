import {Component} from '@angular/core';
import { FittingoServiceApi } from '../shared/shared';


@Component({
    selector: "ion-food-list",
    templateUrl: "food-list.html"
})

export class FoodListPage{
   items = []; 
    constructor(private api: FittingoServiceApi){
        for(let i = 0; i < 100; i++){
        
            let item = {
                title: 'Title' + i,
                body: 'body',
                avatarUrl: 'https://avatars.io/facebook/random'+i
            };
        
            this.items.push(item);
        }
    }

    GetFoodList(){

    }
}