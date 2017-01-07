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

        this.userInfo = this.api.userInfo;
        // this.userInfo = navParams.data;

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

        this.sqlService.UpdateUserWaterCount(count, this.userInfo.userId).then(d=>
        {
            this.presentToast("Su eklendi.");
        });
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

    IsFoodOrExercise(productType: ProductType, itemProductType: ProductType) {
        return productType == itemProductType;
    }

    GetActivitiesFromLocal() {
        this.sqlService.getAllActivityListToday(this.userInfo.userId).then(
            data => {
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
    LogOut() {
        this.nav.setRoot(LoginPage);
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
            this.api.SaveWater(this.userInfo.DailyWater).subscribe(data => {
                console.log("su kaydı update edildi.")
            });
            if (this.userInfo.IsUserSynced == 0) {
                this.api.UpdateUserInfo(this.userInfo).subscribe(data => {
                    console.log("kullanıcı update edildi.")
                });
            }
        }
    }

    GetActivityList() {
        if (Network.connection != "none") {
            this.api.GetActivities().subscribe(data => {
                this.activityList = data;
                this.sqlService.InsertoReplaceActivities(data);
                // this.GetActivitiesFromLocal();
            });
        } 
        // else {
        //     this.GetActivitiesFromLocal();
        // }
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