import { Injectable } from '@angular/core'
import { Http, Response, RequestOptions, Headers } from '@angular/http'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { IUserInfo } from '../login-page/userinfo';

@Injectable()
export class FittingoServiceApi {
    data: IUserInfo
    private baseUrl = 'http://api.fittingo.com'

    constructor(private http: Http) {

    }

    Login(userName, password): Observable<IUserInfo> {
        //  if (this.data) {
        // already loaded data
        //  return Promise.resolve(this.data);
        // }
        let headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        let options = new RequestOptions({
            headers: headers
        });

        let body = 'UserName=' + userName + '&Password=' + password;
        console.log(body);
        return this.http.post(this.baseUrl + '/login', body, options)
            .map((response: Response) => {
                let res = <any>response.json();
                if (res != null && res.UserInfo != null && res.IsSuccess == true) {
                    return <IUserInfo>{
                        userId: res.UserInfo.UserId,
                        email: res.UserInfo.Email,
                        name: res.UserInfo.Name,
                        success: true
                    }
                } else {
                    return <IUserInfo>{
                        success: false
                    }
                }
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    AddFood() : string{
        return "başarılı";
    }

    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}