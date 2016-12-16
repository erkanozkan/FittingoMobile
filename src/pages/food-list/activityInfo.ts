import { ProductType } from '../shared/productType';

export class ActivityInfo {
    ActivityId: string;
    activiyDate: string;
    mealType: number;
    amount: number;
    UserId: number;
    calorie: number;
    ExerciseId: number;
    ActivityName: string;
    ActivityDescription: string;
    ActivityTypeId: number;
    UserActivityId: number;
    IsSynced: number;
    ProductType: ProductType;
    servingTypeId:number;
    constructor(activiyId: string, activiyDate: string, mealType: number,
        amount: number, userId: number, calorie: number, ExerciseId: number,
        ActivityName: string,
        ActivityDescription: string,
        ActivityTypeId: number,
        UserActivityId: number,
        IsSynced: number, ProductType: ProductType,
        servingTypeId:number) {
        this.ActivityId = activiyId;
        this.activiyDate = activiyDate;
        this.mealType = mealType;
        this.amount = amount;
        this.UserId = userId;
        this.calorie = calorie;
        this.ExerciseId = ExerciseId;
        this.ActivityName = ActivityName;
        this.ActivityDescription = ActivityDescription;
        this.ActivityTypeId = ActivityTypeId;
        this.UserActivityId = UserActivityId;
        this.IsSynced = IsSynced;
        this.ProductType = ProductType;
        this.servingTypeId = servingTypeId;
    }
}