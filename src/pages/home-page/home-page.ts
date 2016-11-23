import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { IUserInfo } from '../login-page/userinfo';
import { FoodListPage } from '../food-list/food-list';
import {IFoodInfo} from '../food-list/foodInfo';

import { FittingoServiceApi } from '../shared/shared';

@Component({
    templateUrl: 'home-page.html'
})

export class HomePage {
    userInfo: IUserInfo;
    foodInfo: IFoodInfo
    constructor(public navCtrl: NavController, 
            private navParams: NavParams, private api: FittingoServiceApi ) {
        this.userInfo = navParams.data;
    }

    OpenFoodListPage() {
        this.navCtrl.push(FoodListPage, this.userInfo);
    }
    /*onFoodAdded(foodInfo: IFoodInfo){
        console.log(foodInfo.foodId);
    }*/
}