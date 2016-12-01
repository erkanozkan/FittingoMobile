import { Component } from '@angular/core';
import { FoodService } from '../shared/shared';
import { FormControl } from '@angular/forms';
import { FoodInfo } from '../food-list/foodInfo';
import { ActivityInfo } from '../food-list/activityInfo';
import { NavController, NavParams } from 'ionic-angular';
import { FoodDetailPage } from '../food-detail/food-detail';

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
    userId: number;
    success: boolean;
    productItem: FoodInfo;
    items: any[];
    canDoRequest: boolean = false;

    constructor(private navCtrl: NavController,
        private dataService: FoodService,
        private loadingController: LoadingController,
        private navParams: NavParams, private toastCtrl: ToastController) {


        this.items = [
            {
                ProductName: "Test1",
            },
            {
                ProductName: "Test2",
            },
            {
                ProductName: "Test3",
            }

        ]
        this.userId = this.navParams.data;

        this.searchControl = new FormControl();

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
    OpenItemDetailsPage(product: FoodInfo) {

        var foodDetailInfo = {
            product: product,
            userId: this.userId
        };

        this.navCtrl.push(FoodDetailPage, foodDetailInfo);
    }

    setFilteredItems() {
        if (this.tempFoodList != null && this.searchTerm.length > 2) {
            this.foodList = this.tempFoodList.filter((item) => {
                this.canDoRequest = true;
                return item.ProductName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
            });
        } else {
            this.canDoRequest = false;
            this.foodList = null;
        }
    }

}