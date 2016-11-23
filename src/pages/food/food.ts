import {Component , Output,EventEmitter} from  '@angular/core';
import {IFoodInfo} from '../food-list/foodInfo';
import { FittingoServiceApi } from '../shared/shared';

@Component({
    selector: "ion-addfood",
    templateUrl: "food.html"
})
export class Food {
    message: string;
    foodInfo: IFoodInfo;
    @Output() onFoodAdded = new EventEmitter<IFoodInfo>();

constructor(private api:  FittingoServiceApi){

}

 AddFood(foodInfo) {
    this.onFoodAdded.emit(foodInfo);
   /* this.foodInfo = <IFoodInfo> {
        foodId: 2,
        userId: 3
    };*/

    this.message = this.api.AddFood();
    }
}