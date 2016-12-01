import { Component } from '@angular/core';
import { FoodService } from '../shared/shared';
import { FormControl } from '@angular/forms';
import { FoodInfo } from '../food-list/foodInfo';
import { ActivityInfo } from '../food-list/activityInfo';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController, ToastController } from 'ionic-angular';
import { ServingTypeInfo } from '../food-detail/serve-type-info';

@Component({
    templateUrl: "food-detail.html"
})

export class FoodDetailPage {
    activityInfo: ActivityInfo;
    productItem: FoodInfo;
    userId: number;
    amount: number;
    MealDate: string;
    MealType: number;
    success: boolean;
    type2Gram: number;
    type3Gram: number;
    type1Gram: number;
    servingTypes: ServingTypeInfo[];
    type1Name: string;
    type2Name: string;
    type3Name: string;
    gram: number;
    type1Amount: number;
    type2Amount: number;
    calorie: number;
    ServingTypesArray: any[];
    servingType: number = 0;
    calorie100gramStr: string;
    carbonhydratStr: string;
    proteinStr: string;
    fatStr: string;
    calorie100gram: number;
    carbonhydrat: number;
    protein: number;
    fat: number;
    errorMessages: any[];
    constructor(private navCtrl: NavController,
        private dataService: FoodService,
        private loadingController: LoadingController,
        private navParams: NavParams, private toastCtrl: ToastController) {

        this.productItem = this.navParams.data.product;
        this.userId = this.navParams.data.userId;
        this.MealDate = new Date().toISOString();
        this.ServingTypesArray = [{
            Value: "0",
            Text: "Gram"
        }]

        console.log(this.productItem)
        this.fatStr = this.productItem.Fat.toString();
        this.calorie100gram = Math.floor(this.productItem.Kalori100Gram);
        this.calorie100gramStr = this.calorie100gram.toString();
        this.proteinStr = this.productItem.Protein.toString();
        this.carbonhydratStr = this.productItem.Carbonhydrate.toString();

        this.GetServiceTypeList(0);
        console.log(this.ServingTypesArray);
    }

    GetServiceTypeNames() {

        if (this.productItem.Type1 != null) {
            this.type1Name = this.FilterServingTypes(this.productItem.Type1)
            this.ServingTypesArray.push({
                Value: this.productItem.Type1.toString(),
                Text: this.type1Name
            })
        }

        if (this.productItem.Type2 != null) {
            this.type2Name = this.FilterServingTypes(this.productItem.Type2)
            this.ServingTypesArray.push({
                Value: this.productItem.Type2.toString(),
                Text: this.type2Name
            })
        }
    }

    FilterServingTypes(filterValue: number): string {
        var servingTypeName: string = "";
        this.servingTypes.filter(function (x) {
            if (x.ServingTypeId == filterValue) {
                servingTypeName = x.ServingTypeName;
            }
        })
        return servingTypeName;
    }


    CalculateCalorie() {

        if (this.servingType == 0) { //gram
            this.calorie = (this.calorie100gram * this.gram) / 100;
            this.carbonhydrat = (this.productItem.Carbonhydrate * this.gram) / 100;
            this.fat = (this.productItem.Fat * this.gram) / 100;
            this.protein = (this.productItem.Protein * this.gram) / 100;
        } else if (this.servingType == this.productItem.Type1) {
            this.calorie = (this.calorie100gram * this.productItem.Type1Gram * this.type1Gram) / 100;
            this.carbonhydrat = (this.productItem.Type1Gram * this.productItem.Carbonhydrate * this.type1Gram) / 100;
            this.fat = (this.productItem.Type1Gram * this.productItem.Fat * this.type1Gram) / 100;
            this.protein = (this.productItem.Type1Gram * this.productItem.Protein * this.type1Gram) / 100;
        }
        else if (this.servingType == this.productItem.Type2) {
            this.calorie = (this.productItem.Type2Gram * this.type2Gram) / 100;
            this.carbonhydrat = (this.productItem.Type2Gram * this.productItem.Carbonhydrate * this.type2Gram) / 100;
            this.fat = (this.productItem.Type2Gram * this.productItem.Fat * this.type2Gram) / 100;
            this.protein = (this.productItem.Type2Gram * this.productItem.Protein * this.type2Gram) / 100;
        }
        this.carbonhydratStr = this.carbonhydrat.toFixed(2).toString();
        this.calorie100gramStr = Math.floor(this.calorie).toString();
        this.proteinStr = this.protein.toFixed(2).toString();
        this.fatStr = this.fat.toFixed(2).toString();
    }

    CheckServingType(typeId: number) {
        return typeId == this.servingType;
    }

    GetServiceTypeList(serviceTypeId: number) {
        this.dataService.GetServiceTypeList(serviceTypeId)
            .subscribe(data => {
                this.servingTypes = data
                this.GetServiceTypeNames();
            });
    }

    CheckItemValues(): boolean {
        this.errorMessages = [];
        if (this.MealDate == null) {
            this.errorMessages.push({
                message: "Bir tarih seçiniz."
            });
        }
        if (this.MealType == null || this.MealType == 0) {
            this.errorMessages.push({
                message: "Bir öğün seçiniz."
            });
        }
        if (this.servingType == 0 && (this.gram == null || this.gram == 0)) {
            this.errorMessages.push({
                message: "Bir miktar giriniz."
            });
        }
        console.log(this.errorMessages);

        return this.errorMessages.length == 0 ? true : false;
    }
    AddFood() {
        var value = this.CheckItemValues();
        if (value == false) { 
            return;
        } 
        var activityInfo = new ActivityInfo(this.productItem, this.MealDate,
            this.MealType, this.amount,
            this.userId, this.calorie);

        this.dataService.AddFoodActivity(activityInfo).
            subscribe(data => {
                this.success == data;
                this.presentToast("Yemek eklendi.");
            });
    }

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