import { FoodInfo } from '../food-list/foodInfo';
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
    constructor(private http : Http) {
    }
    

      GetAllFoodList() :Observable<FoodInfo[]> {
       
            return this.http.get(this.baseUrl + '/products/all')
                        // ...and calling .json() on the response to return data
                         .map((res:Response) => res.json().ProductList as FoodInfo[])
                         //...errors if any
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error'));


    }

}