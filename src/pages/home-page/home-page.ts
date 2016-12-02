import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { IUserInfo } from '../login-page/userinfo';
import { FoodListPage } from '../food-list/food-list';
import { FoodInfo } from '../food-list/foodInfo';
import { SportListPage } from '../sport-list/sport-list';


@Component({
    templateUrl: 'home-page.html'
})

export class HomePage {
    userInfo: IUserInfo;
    foodInfo: FoodInfo
    constructor(private navCtrl: NavController,
        private navParams: NavParams) {
        this.userInfo = navParams.data;
    }

    OpenFoodListPage() {
        this.navCtrl.push(FoodListPage, this.userInfo.userId);
    }
    OpenSportsListPage() {
        var sportListInfo = {
            userId: this.userInfo.userId,
            Weight: this.userInfo.Weight
        }
        this.navCtrl.push(SportListPage, sportListInfo);
    }
}