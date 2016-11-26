import { Component } from '@angular/core';
import { FoodService } from '../shared/shared';
import { FormControl } from '@angular/forms';
import { FoodInfo } from '../food-list/foodInfo';
import { ActivityInfo } from '../food-list/activityInfo';
import { NavController, NavParams } from 'ionic-angular';

import { LoadingController, ToastController } from 'ionic-angular';

@Component({
    selector: "ion-food-list",
    templateUrl: "food-list.html"
})

export class FoodListPage {
    searchTerm: string = '';
    searchControl: FormControl;
    foodList: Array<FoodInfo>;
    tempFoodList: Array<FoodInfo>;
    searching: any = false;
    isLoaded: boolean = false;
    loading = false;
    MealType: number;
    MealDate: string;
    userId: number;
    amount: number;
    success: boolean;

    constructor(private navCtrl: NavController,
        private dataService: FoodService,
        private loadingController: LoadingController,
        private navParams: NavParams, private toastCtrl: ToastController) {

        this.userId = this.navParams.data;
        console.log(this.userId);

        this.searchControl = new FormControl();

        this.MealDate = new Date().toISOString();;

        this.loading = true;
        let loader = this.loadingController.create({
            content: 'Yemekler getiriliyor...',
        });
        loader.present().then(() => {
            dataService.GetAllFoodList().subscribe(data => this.tempFoodList = data);
            this.isLoaded = true;
            loader.dismiss();
        });
    }
    ionViewDidLoad() {
        this.searchControl.valueChanges.subscribe(search => {
            this.searching = false;
            this.setFilteredItems();
        });
    }
    onSearchInput() {
        if (this.searchTerm.length > 2) {
            this.searching = true;
        }
    }
    setFilteredItems() {
        if (this.tempFoodList != null && this.searchTerm.length > 2) {
            this.foodList = this.tempFoodList.filter((item) => {
                return item.ProductName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
            });
        } else {
            this.foodList = null;
        }
    }

    AddFood(product: FoodInfo) {


        var calorie = (this.amount * product.Kalori100Gram * product.Type1Gram) / 100;
        var activityInfo = new ActivityInfo(product, this.MealDate, this.MealType, this.amount,
            this.userId, calorie);
        this.dataService.AddFoodActivity(activityInfo).
            subscribe(data => {
                this.success == data;
                this.presentToast("Yemek eklendi.");
            });
    }

    presentToast(message: string) {

        console.log(message);
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            cssClass: "toast"
        });
        toast.present();
    }
}