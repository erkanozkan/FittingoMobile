import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Nav } from 'ionic-angular';
import { IUserInfo } from '../login-page/userinfo';
import { FoodListPage } from '../food-list/food-list';
import { SportListPage } from '../sport-list/sport-list';
import { LoginPage } from '../login-page/login-page';
import { ProductType } from '../shared/productType';

import { FittingoServiceApi, SqlStorageService } from '../shared/shared';
import { ActivityInfo } from '../food-list/activityInfo';
import { Network } from 'ionic-native';
import { Observable } from 'rxjs/Rx';


@Component({
    selector: "home-page",
    templateUrl: 'home-page.html'
})

export class HomePage {
    userInfo: IUserInfo;
    activityList: Array<ActivityInfo>;

    constructor(private navCtrl: NavController,
        private navParams: NavParams,
        private api: FittingoServiceApi,
        private toastCtrl: ToastController,
        private nav: Nav, private sqlService: SqlStorageService) {


        // this.userInfo = <IUserInfo>{
        //     userId: 1,
        //     email: "string",
        //     name: "Erkan",
        //     success: true,
        //     password: "string",
        //     Weight: 89,
        //     RemainingCalorie: 1678,
        //     TakenCalorie: 1092,
        //     CalorieExpenditure: 1289,
        //     BadgeLevel: 129,
        //     GoalWater: 9,
        //     DailyWater: 7,
        //     DailyCalories: 1987
        // };
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

    AddWater() {
        var count = this.userInfo.DailyWater + 1;
        if (count > this.userInfo.GoalWater) {
            this.presentToast("Max su limitine ulaşıldı.");
            return;
        }
        this.userInfo.DailyWater = this.userInfo.DailyWater + 1;

        this.sqlService.UpdateUserWaterCount(count, this.userInfo.userId);
    }

    LogOut() {
        this.api.userInfo = null;
        this.nav.setRoot(LoginPage);
    }

    RemoveWater() {
        var count = this.userInfo.DailyWater - 1;
        if (count < 0) {
            this.presentToast("Günde en az bir bardak su içmelisiniz.");
            return;
        }
        this.userInfo.DailyWater = this.userInfo.DailyWater - 1;
        this.sqlService.UpdateUserWaterCount(count, this.userInfo.userId);
    }

    IsFoodOrExercise(productType: ProductType,itemProductType: ProductType){
        console.log(productType);
        console.log(itemProductType);
        
        return productType == itemProductType;
    }

    GetActivitiesFromLocal() {
        this.sqlService.getAllActivityListToday(this.userInfo.userId).then(
            data => {
                console.log("sqlService.getAllActivityListToday");

                console.log(data);
                if (data != null || data != undefined) {
                    this.activityList = data;
                }
            });
    }

    ionViewDidEnter() {
        this.GetActivityList();
        this.RefreshUser();
        this.SendActivityListToApi();
    }

    RefreshUser() {
        //kullanıcıyı lokal den getir.
        this.sqlService.getUser(this.userInfo.email, this.userInfo.password).then(user => {
        
            if (user != null || user != undefined) {
                this.userInfo = user;
            }
        });

        if (Network.connection != "none") {
            //api den kullanıyı çek
            this.api.Login(this.userInfo.email, this.userInfo.password)
                .subscribe(data => {
                    if (this.userInfo.DailyWater > data.DailyWater) { //Send water to api
                        this.api.SaveWater(this.userInfo.DailyWater).subscribe(data => {
                        });
                    } else if (this.userInfo.DailyWater < data.DailyWater) {
                        this.sqlService.UpdateUserWaterCount(data.DailyWater, this.userInfo.userId);
                        this.userInfo.DailyWater = data.DailyWater;
                    }
                });
        }
    }

    GetActivityList() {
        if (Network.connection != "none") {
            this.api.GetActivities().subscribe(data => {
                this.activityList = data;
                console.log(this.activityList);
                this.sqlService.InsertoReplaceActivities(data);
                this.GetActivitiesFromLocal();
            });
        }
    }

    SendWaterCountToApi() {
        if (Network.connection != "none") {
            this.api.SaveWater(this.userInfo.DailyWater).subscribe(data => {
                console.log(data);
            });
        }
    }

    SendActivityListToApi() {
        if (Network.connection != "none") {
            this.sqlService.SyncedActivitiesWithApi();
        }
    }

    presentToast(message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            cssClass: "toast"
        });
        toast.present();
    }
}