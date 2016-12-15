import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Nav } from 'ionic-angular';
import { IUserInfo } from '../login-page/userinfo';
import { FoodListPage } from '../food-list/food-list';
import { SportListPage } from '../sport-list/sport-list';
import { LoginPage } from '../login-page/login-page';

import { FittingoServiceApi, SqlStorageService } from '../shared/shared';
import { ActivityInfo } from '../food-list/activityInfo';
import { Network } from 'ionic-native';


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
         // this.navCtrl.push(LoginPage);
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
    // ionViewWillEnter() {
    //     console.log("ionViewWillEnter")
    // }

    ionViewDidEnter() {
        this.GetActivityList();
        this.RefreshUserList();
    }
    // onPageDidEnter() {
    //     console.log("onPageDidEnter")
    // }
    // onPageWillEnter() {
    //     console.log("onPageWillEnter")
    // }

    RefreshUserList() {
        this.sqlService.getUser(this.userInfo.email, this.userInfo.password).then(user => {

            this.userInfo = user;
        });
    }

    GetActivityList() {
        if (Network.connection != "none") {
            this.api.GetActivities().subscribe(data => {
                this.activityList = data;
                this.sqlService.InsertoReplaceActivities(this.activityList);
                setTimeout(() => { }, 1000);
                this.GetActivitiesFromLocal();

            });
        } else {
            this.GetActivitiesFromLocal();
        }
    }

    GetActivitiesFromLocal() {

        this.sqlService.getAllActivityListToday().then(
            data => {
                this.activityList = data;
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