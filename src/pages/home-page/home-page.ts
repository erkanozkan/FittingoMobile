import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { IUserInfo } from '../login-page/userinfo';
import { FoodListPage } from '../food-list/food-list';
import { FoodInfo } from '../food-list/foodInfo';
import { SportListPage } from '../sport-list/sport-list';
import { FittingoServiceApi } from '../shared/shared';


@Component({
    templateUrl: 'home-page.html'
})

export class HomePage {
    userInfo: IUserInfo;
    foodInfo: FoodInfo
    constructor(private navCtrl: NavController,
        private navParams: NavParams,
        private api: FittingoServiceApi,
        private toastCtrl: ToastController) {

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
        this.api.SaveWater(1).subscribe(data => {
            if (data == true) {
                this.userInfo = this.api.userInfo;
                this.presentToast("İşlem başarılı");
            } else {
                this.presentToast("İşlem tamamlanamadı.");
            }
        });
    }

    RemoveWater() {
        this.api.SaveWater(-1).subscribe(data => {
            if (data == true) {
                this.userInfo = this.api.userInfo;
                this.presentToast("İşlem başarılı");
            } else {
                this.presentToast("İşlem tamamlanamadı.");
            }
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