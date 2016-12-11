import { ProductType } from '../shared/productType';

export class ActivityInfo {
    activiyDate: string;
    mealType: number;
    amount: number;
    userId: number;
    calorie: number;
    ExerciseId: number;
    ActivityName: string;
    ActivityDescription: string;
    ActivityTypeId: number;
    UserActivityId: number;
    IsSynced:number;
    ProductType: ProductType;
    constructor(activiyDate: string, mealType: number,
        amount: number, userId: number, calorie: number, ExerciseId: number,
        ActivityName: string,
        ActivityDescription: string,
        ActivityTypeId: number,
        UserActivityId: number,
        IsSynced : number, ProductType:ProductType) {
        this.activiyDate = activiyDate;
        this.mealType = mealType;
        this.amount = amount;
        this.userId = userId;
        this.calorie = calorie;
        this.ExerciseId = ExerciseId;
        this.ActivityName = ActivityName;
        this.ActivityDescription = ActivityDescription;
        this.ActivityTypeId = ActivityTypeId;
        this.UserActivityId = UserActivityId;
        this.IsSynced = IsSynced;
        this.ProductType = ProductType;
    }
}