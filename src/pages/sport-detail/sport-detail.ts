import { Component } from '@angular/core';
import { SportService } from '../shared/shared';
import { FormControl } from '@angular/forms';
import { SportInfo } from '../sport-list/sportInfo';
import { ActivityInfo } from '../food-list/activityInfo';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController, ToastController } from 'ionic-angular';
import { ServingTypeInfo } from '../food-detail/serve-type-info';

@Component({
    templateUrl: "sport-detail.html"
})

export class SportDetailPage {
    activityInfo: ActivityInfo;
    productItem: SportInfo;
    userId: number;
    totalTime: number = 0;
    SportDate: string;
    success: boolean;
    Weight: number;

    calorie: number;
    ServingTypesArray: any[];
    servingType: number = 0;

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
        this.calorie = Math.round((this.totalTime / 60) * this.Weight * this.servingType);
        console.log(this.calorie);
        }

    CheckServingType(typeId: number) {
        return typeId == this.servingType;
    }

    CheckItemValues(): boolean {
        this.errorMessages = [];
        if (this.SportDate == null) {
            this.errorMessages.push({
                message: "Bir tarih seçiniz."
            });
        }

        return this.errorMessages.length == 0 ? true : false;
    }
    // AddFood() {
    //     var value = this.CheckItemValues();
    //     if (value == false) { 
    //         return;
    //     } 
    //     var activityInfo = new ActivityInfo(this.productItem, this.MealDate,
    //         this.MealType, this.amount,
    //         this.userId, this.calorie);

    //     this.dataService.AddFoodActivity(activityInfo).
    //         subscribe(data => {
    //             this.success == data;
    //             this.presentToast("Yemek eklendi.");
    //         });
    // }

    presentToast(message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            cssClass: "toast"
        });
        toast.present();
        this.navCtrl.pop();
    }

}