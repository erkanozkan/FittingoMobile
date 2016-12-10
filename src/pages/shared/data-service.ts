import { Injectable } from '@angular/core'
import { Http, Response, RequestOptions, Headers } from '@angular/http'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { IUserInfo } from '../login-page/userinfo';
import { ActivityListInfo } from '../activity-list/activityListInfo';

import { FoodInfo } from '../food-list/foodInfo';
import { ResponseBase, FittingoServiceApi, SqlStorageService } from './shared';

@Injectable()
export class DataService {
    userInfo: IUserInfo;
    responseBase: ResponseBase;
    activityListInfo: ActivityListInfo;
    apiService: FittingoServiceApi;
    sqlService: SqlStorageService;

    private baseUrl = 'http://api.fittingo.com'

    constructor() {
 
    }

    // GetUser(email, password) {
    //     this.sqlService.getUser(email, password)
    //         .then(data => {
    //             if (data != undefined && data != null) {
    //                 this.userInfo = <IUserInfo>{
    //                     userId: data.userId,
    //                     email: data.email,
    //                     name: data.name,
    //                     Weight: data.Weight,
    //                     RemainingCalorie: data.RemainingCalorie,
    //                     BadgeLevel: data.BadgeLevel,
    //                     DailyCalories: data.DailyCalories,
    //                     GoalWater: data.GoalWater,
    //                     DailyWater: data.DailyWater,
    //                     TakenCalorie: data.TakenCalorie,
    //                     CalorieExpenditure: data.CalorieExpenditure,
    //                     success: true
    //                 };
    //             } else {
    //                 this.GetUserFromApi(email, password);
    //                 if (this.userInfo != null && this.userInfo.success == true) {
    //                     this.sqlService.InsertUser(this.userInfo);
    //                 }
    //             }
    //         });
 
    // }

    // GetUserFromApi(email, password) {
    //     //eğer user bulunamadıysa api'den çek
    //     console.log("api ye geldi");
    //     return this.apiService.Login(email, password)
    //         .subscribe(data => {
    //             this.userInfo = data;
    //         });
    // }
    // private handleError(error: Response) {
    //     // in a real world app, we may send the server to some remote logging infrastructure
    //     // instead of just logging it to the console
    //     console.error(error);
    //     return Observable.throw(error.json().error || 'Server error');
    // }
}