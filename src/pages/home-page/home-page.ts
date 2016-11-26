import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { IUserInfo } from '../login-page/userinfo';
import { FoodListPage } from '../food-list/food-list';
import {FoodInfo} from '../food-list/foodInfo';


@Component({
    templateUrl: 'home-page.html'
})

export class HomePage {
    userInfo: IUserInfo;
    foodInfo: FoodInfo
    constructor(private navCtrl: NavController, 
            private navParams: NavParams ) {
        this.userInfo = navParams.data;
    }

    OpenFoodListPage() {
        console.log(this.userInfo);
        this.navCtrl.push(FoodListPage, this.userInfo.userId);
    }
    /*onFoodAdded(foodInfo: IFoodInfo){
        console.log(foodInfo.foodId);
    }*/
}