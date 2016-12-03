import { SportInfo } from '../sport-list/sportInfo';

export class ExerciseInfo {
    product: SportInfo;
    activiyDate: string;
    description: string;
    amount: number;
    userId: number;
    calorie: number;

    constructor(product: SportInfo, activiyDate: string, description: string,
        amount: number, userId: number, calorie: number) {
        this.product = product;
        this.activiyDate = activiyDate;
        this.description = description;
        this.amount = amount;
        this.userId = userId;
        this.calorie = calorie; 
    }
}