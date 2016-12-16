import { SportInfo } from '../sport-list/sportInfo';
import { ExerciseInfo } from '../sport-list/exerciseInfo';
import { ActivityInfo } from '../food-list/activityInfo';

import { Injectable } from '@angular/core'
import { Http, Response, RequestOptions, Headers } from '@angular/http'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class SportService {
    sportList: Array<SportInfo>;
    private baseUrl = 'http://api.fittingo.com'
    constructor(private http: Http) {
    }

    GetAllSportList(): Observable<SportInfo[]> {
        return this.http.get(this.baseUrl + '/activities/exercises?exerciseId=0')
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json().Exercises as SportInfo[])
            //...errors if any
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

    }

    AddSportActivity(activityInfo: ActivityInfo): Observable<number> {
        let headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        let options = new RequestOptions({
            headers: headers
        });

        let body = 'ActivityDateTime=' + activityInfo.activiyDate
            + '&Amount=' + Math.floor(activityInfo.amount)
            + '&Calorie=' + Math.floor(activityInfo.calorie)
            + '&ActivityName=' + activityInfo.ActivityName
            + '&ActivityDescription=' + activityInfo.ActivityDescription
            + '&ExerciseId=' + activityInfo.ExerciseId
            + '&UserId=' + activityInfo.UserId
        console.log("spor api kayıt");

        console.log(body);
        return this.http.post(this.baseUrl + '/activities/exercises/save', body, options)
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
}