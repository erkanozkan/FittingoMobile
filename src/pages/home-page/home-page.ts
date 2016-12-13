import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Nav } from 'ionic-angular';
import { IUserInfo } from '../login-page/userinfo';
import { FoodListPage } from '../food-list/food-list';
import { SportListPage } from '../sport-list/sport-list';
import { LoginPage } from '../login-page/login-page';

import { FittingoServiceApi, SqlStorageService } from '../shared/shared';
import { ActivityInfo } from '../food-list/activityInfo';


@Component({
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

        this.api.SaveWater(1).subscribe(data => {
            if (data == true) {
                this.userInfo = this.api.userInfo;
                this.presentToast("İşlem başarılı");
            } else {
                this.presentToast("İşlem tamamlanamadı.");
            }
        });
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
        this.api.SaveWater(-1).subscribe(data => {
            if (data == true) {
                this.userInfo = this.api.userInfo;
                this.presentToast("İşlem başarılı");
            } else {
                this.presentToast("İşlem tamamlanamadı.");
            }
        });
    }
    ionViewWillEnter() {
        console.log("ionViewWillEnter")
    }

    ionViewDidEnter() {
        this.GetActivityList();
    }
    onPageDidEnter() {
        console.log("onPageDidEnter")
    }
    onPageWillEnter() {
        console.log("onPageWillEnter")
    }

    GetActivityList() {

        this.sqlService.getAllActivityListToday().then(
            data => {
                console.log("1");
                console.log(data);
                // if (data != undefined || data != null || data.length != 0) {
                //     this.activityList = data;
                // } 
                // else {
                this.api.GetActivities().subscribe(data => {
                    console.log("2");
                    console.log(data);
                    this.activityList = data;
                    this.sqlService.InsertoReplaceActivities(this.activityList);
                });
                // }
            });
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