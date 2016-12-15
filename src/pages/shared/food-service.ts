import { FoodInfo } from '../food-list/foodInfo';
import { ActivityInfo } from '../food-list/activityInfo';
import { ServingTypeInfo } from '../food-detail/serve-type-info';

import { Injectable } from '@angular/core'
import { Http, Response, RequestOptions, Headers } from '@angular/http'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class FoodService {
    foodList: Array<FoodInfo>;
    private baseUrl = 'http://api.fittingo.com'
    constructor(private http: Http) {
    }


    GetAllFoodList(): Observable<FoodInfo[]> {
        return this.http.get(this.baseUrl + '/products/all')
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json().ProductList as FoodInfo[])
            //...errors if any
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

    }

    AddFoodActivity(activityInfo: ActivityInfo): Observable<number> {
        let headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        let options = new RequestOptions({
            headers: headers
        });
        let body = 'ActivityDateTime=' + activityInfo.activiyDate
            + '&Amount=' + activityInfo.amount
            + '&Calories=' + Math.floor(activityInfo.calorie)
            + '&ServingTypeId=' + activityInfo.servingTypeId
            + '&ActivityTypeId=1'
            + '&UserActivityId=' + activityInfo.UserActivityId
            + '&UserId=' + activityInfo.userId
            + '&MealId=' + activityInfo.mealType;
        console.log("yeni kayıt");

        console.log(body);
        return this.http.post(this.baseUrl + '/activities/add', body, options)
            .map((response: Response) => {
                let res = <any>response.json();
                if (res != null && res.IsSuccess == true) {
                    return res.ActivityId;
                } else {
                    return 0;
                }
            })
            //.do(data => console.log('All: ' + JSON.stringify(data)))
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    GetServiceTypeList(servingTypeId: number): Observable<ServingTypeInfo[]> {
        return this.http.get(this.baseUrl + '/activities/servingTypes?servingTypeId=' + servingTypeId)
            .map((res: Response) => res.json().ServingTypes as ServingTypeInfo[])
            //.do(data => console.log('All: ' + JSON.stringify(data)))
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

}