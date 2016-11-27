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
    MealType1: number;
    success: boolean;
    type2Gram: number;
    type3Gram: number;
    type1Gram: number;
    servingTypes: ServingTypeInfo[];
    type1Name: string;
    type2Name: string;
    type3Name: string;
    gram:number;
    type1Amount:number;
    type2Amount:number;

    ServingTypesArray:any[];
   servingType: number = 0;
    

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
        this.GetServiceTypeList(0);
       console.log(this.ServingTypesArray);
    }

    GetServiceTypeNames() {
        
        if (this.productItem.Type1 != null) {
            this.type1Name = this.FilterServingTypes(this.productItem.Type1)
            this.ServingTypesArray.push({
                Value :this.productItem.Type1.toString(),
                Text:this.type1Name
            })
        }
       
        if (this.productItem.Type2 != null) {
            this.type2Name = this.FilterServingTypes(this.productItem.Type2)
             this.ServingTypesArray.push({
                Value :this.productItem.Type2.toString(),
                Text:this.type2Name
            })
        }

        // if (this.productItem.Type3 != null) {
        //     this.type3Name = this.FilterServingTypes(this.productItem.Type3)
        //      this.ServingTypesArray.push({
        //         Value :this.productItem.Type3,
        //         Text:this.type3Name
        //     })
        // }
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


CheckServingType(typeId:number){
    return typeId == this.servingType;
}

    GetServiceTypeList(serviceTypeId: number) {
        this.dataService.GetServiceTypeList(serviceTypeId)
            .subscribe(data => {
                this.servingTypes = data
                this.GetServiceTypeNames();
            });
    }

    AddFood() {
        var calorie = (this.amount * this.productItem.Kalori100Gram * this.productItem.Type1Gram) / 100;
        var activityInfo = new ActivityInfo(this.productItem, this.MealDate,
            this.MealType, this.amount,
            this.userId, calorie);

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
    }

}