import { Injectable } from '@angular/core'
import { Http, Response, RequestOptions, Headers } from '@angular/http'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { IUserInfo } from '../login-page/userinfo';
import { ActivityListInfo } from '../activity-list/activityListInfo';

import { FoodInfo } from '../food-list/foodInfo';
import { ActivityInfo } from '../food-list/activityInfo';
import { ResponseBase } from './shared';

@Injectable()
export class FittingoServiceApi {
    userInfo: IUserInfo;
    responseBase: ResponseBase;
    activityListInfo: ActivityListInfo;

    private baseUrl = 'http://api.fittingo.com'

    constructor(private http: Http) {

    }


    Login(userName, password): Observable<IUserInfo> {

        let headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        let options = new RequestOptions({
            headers: headers
        });

        let body = 'UserName=' + userName + '&Password=' + password;
        return this.http.post(this.baseUrl + '/login', body, options)
            .map((response: Response) => {
                let res = <any>response.json();
                if (res != null && res.UserInfo != null && res.IsSuccess == true) {
                    this.userInfo = <IUserInfo>{
                        userId: res.UserInfo.UserId,
                        email: res.UserInfo.Email,
                        name: res.UserInfo.Name,
                        Weight: res.UserInfo.CurrentWeight,
                        RemainingCalorie: res.UserInfo.RemainingCalorie,
                        BadgeLevel: res.UserInfo.BadgeLevel,
                        DailyCalories: res.UserInfo.DailyCalories,
                        GoalWater: res.UserInfo.GoalWater,
                        DailyWater: res.UserInfo.DailyWater,
                        TakenCalorie: res.UserInfo.TakenCalorie,
                        CalorieExpenditure: res.UserInfo.CalorieExpenditure,
                        success: true,
                        password: password
                    }
                    return this.userInfo;
                } else {
                    this.userInfo = <IUserInfo>{
                        success: false
                    }
                    return this.userInfo;
                }
            })
            .catch(this.handleError);
    }

    GetActivities(): Observable<ActivityInfo[]> {

        let headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        let options = new RequestOptions({
            headers: headers
        });
        var today = new Date();
        var requestDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();

        let body = 'ActivityDatetime=' + requestDate + '&UserId=' + this.userInfo.userId;
        return this.http.post(this.baseUrl + '/activities/daily', body, options)
            .map((res: Response) => res.json().Activities as ActivityInfo[])
            .catch(this.handleError);
    }

    SaveWater(count: number): Observable<boolean> {
        let headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        let options = new RequestOptions({
            headers: headers
        });

        var today = new Date();
        var requestDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();

        let body = 'RequestDate=' + requestDate
            + '&Number=' + count
            + '&UserId=' + this.userInfo.userId;

        return this.http.post(this.baseUrl + '/products/water/save', body, options)
            .map((response: Response) => {
                let res = <any>response.json();
                if (res != null && res.IsSuccess == true) {
                    this.userInfo.DailyWater = count;
                    return res.IsSuccess;
                } else {
                    return false;
                }
            })
            .catch(this.handleError);
    }

    CreateAccount(email: string, name: string, surname: string, password: string): Observable<ResponseBase> {
        let headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        let options = new RequestOptions({
            headers: headers
        });

        let body = 'Email=' + email
            + '&Name=' + name
            + '&SurName=' + surname
            + '&Password=' + password;
        return this.http.post(this.baseUrl + '/accounts/create', body, options)
            .map((response: Response) => {
                let res = <any>response.json();
                return <ResponseBase>{
                    success: res.IsSuccess,
                    message: res.Message
                }
            })
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}