import { FoodInfo } from '../food-list/foodInfo';

export class ActivityInfo {
    product: FoodInfo;
    activiyDate: string;
    mealType: number;
    amount: number;
    userId: number;
    calorie: number;

    constructor(product: FoodInfo, activiyDate: string, mealType: number,
    amount: number,userId:number, calorie: number) {
        this.product = product;
        this.activiyDate = activiyDate;
        this.mealType = mealType;
        this.amount = amount;
        this.userId = userId;
        this.calorie= calorie;
    }
}