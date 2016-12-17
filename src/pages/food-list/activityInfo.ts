import { ProductType } from '../shared/productType';

export class ActivityInfo {
    ActivityId: string;
    ActivityDateTime: string;
    MealId: number;
    Amount: number;
    UserId: number;
    Calorie: number;
    ExerciseId: number;
    ActivityName: string;
    ActivityDescription: string;
    ActivityTypeId: number;
    UserActivityId: number;
    IsSynced: number;
    ProductType: ProductType;
    ServingTypeId:number;
    constructor(activiyId: string, activiyDate: string, mealType: number,
        amount: number, userId: number, calorie: number, ExerciseId: number,
        ActivityName: string,
        ActivityDescription: string,
        ActivityTypeId: number,
        UserActivityId: number,
        IsSynced: number, ProductType: ProductType,
        servingTypeId:number) {
        this.ActivityId = activiyId;
        this.ActivityDateTime = activiyDate;
        this.MealId = mealType;
        this.Amount = amount;
        this.UserId = userId;
        this.Calorie = calorie;
        this.ExerciseId = ExerciseId;
        this.ActivityName = ActivityName;
        this.ActivityDescription = ActivityDescription;
        this.ActivityTypeId = ActivityTypeId;
        this.UserActivityId = UserActivityId;
        this.IsSynced = IsSynced;
        this.ProductType = ProductType;
        this.ServingTypeId = servingTypeId;
    }
}