import { Component } from '@angular/core';
import { SportService } from '../shared/shared';
import { FormControl } from '@angular/forms';
import { SportInfo } from '../sport-list/sportInfo';
import { ExerciseInfo } from '../sport-list/exerciseInfo';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController, ToastController } from 'ionic-angular';
import { ServingTypeInfo } from '../food-detail/serve-type-info';

@Component({
    templateUrl: "sport-detail.html"
})

export class SportDetailPage {
    productItem: SportInfo;
    userId: number;
    totalTime: number = 0;
    SportDate: string;
    success: boolean = false;
    Weight: number;

    calorie: number;
    ServingTypesArray: any[];
    servingType: number = 0;
    isCalorieSet: boolean = false;
    errorMessages: any[];

    constructor(private navCtrl: NavController,
        private dataService: SportService,
        private loadingController: LoadingController,
        private navParams: NavParams, private toastCtrl: ToastController) {

        this.productItem = this.navParams.data.product;
        this.userId = this.navParams.data.userId;
        this.Weight = this.navParams.data.Weight;

        this.SportDate = new Date().toISOString();
        this.ServingTypesArray = new Array();
        this.GetServiceTypeNames();
        this.servingType = 0;
    }

    GetServiceTypeNames() {

        if (this.productItem.Level1 != null && this.productItem.Level1 != 0) {
            this.ServingTypesArray.push({
                Value: this.productItem.Level1,
                Text: "Düşük",
                Selected: true
            })
        }

        if (this.productItem.Level2 != null && this.productItem.Level2 != 0) {
            this.ServingTypesArray.push({
                Value: this.productItem.Level2,
                Text: "Orta",
                Selected: false
            })
        }

        if (this.productItem.Level3 != null && this.productItem.Level3 != 0) {
            this.ServingTypesArray.push({
                Value: this.productItem.Level3,
                Text: "Yüksek",
                Selected: false
            })
        }
    }

    CalculateCalorie() {
        this.calorie = Math.floor((this.totalTime / 60) * this.Weight * this.servingType);
        this.isCalorieSet = true;
    }

    CheckItemValues(): boolean {
        this.errorMessages = [];
        if (this.SportDate == null) {
            this.errorMessages.push({
                message: "Bir tarih seçiniz."
            });
        }

        if (this.servingType == null) {
            this.errorMessages.push({
                message: "Bir seviye seçiniz."
            });
        }

        if (this.calorie == null || this.calorie <= 0) {
            this.errorMessages.push({
                message: "Geçerli bir süre giriniz."
            });
        }

        return this.errorMessages.length == 0 ? true : false;
    }
    AddSport() {
        var value = this.CheckItemValues();
        if (value == false) {
            return;
        }
        var description = this.totalTime.toString() + " Dakika " + this.productItem.ExerciseName;

        var activityInfo = new ExerciseInfo(this.productItem, this.SportDate,
            description, this.totalTime,
            this.userId, this.calorie);

        this.dataService.AddSportActivity(activityInfo).
            subscribe(data => {
                this.success = data;
                if (this.success == true) {
                    this.presentToast("Spor eklendi.");
                } else {
                    this.presentToast("Bir hata oluştu.");
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
        if (this.success == true) {
            this.navCtrl.pop();
        }
    }

}