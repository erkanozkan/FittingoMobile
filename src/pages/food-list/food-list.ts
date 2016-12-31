import { Component } from '@angular/core';
import { FoodService, SqlStorageService } from '../shared/shared';
import { FormControl } from '@angular/forms';
import { FoodInfo } from '../food-list/foodInfo';
import { ActivityInfo } from '../food-list/activityInfo';
import { NavController, NavParams } from 'ionic-angular';
import { FoodDetailPage } from '../food-detail/food-detail';

import { LoadingController, ToastController, Loading } from 'ionic-angular';

@Component({
    selector: "food-list-page",
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
    canDoRequest: boolean = false;
    loader: Loading;
    constructor(private navCtrl: NavController,
        private dataService: FoodService,
        private loadingController: LoadingController,
        private navParams: NavParams,
        private toastCtrl: ToastController,
        private sqlService: SqlStorageService) {

        this.userId = this.navParams.data;

        this.searchControl = new FormControl();

        this.loading = true;
        this.loader = this.loadingController.create({
            content: 'Yemekler getiriliyor...',
        });
        this.loader.present().then(() => {
            sqlService.getAllFoodList().then(data => {
                if (data == null || data.length == 0) {
                    dataService.GetAllFoodList().subscribe(data => {
                        this.tempFoodList = data;
                        this.foodList = data;
                        this.loader.setContent("Yemekler kaydediliyor...")
                        this.sqlService.BulkInsertFoods(this.tempFoodList);
                        this.isLoaded = true;
                        this.loader.dismiss();
                    });
                } else {
                    this.tempFoodList = data;
                    this.foodList = data;
                    this.isLoaded = true;
                    this.loader.dismiss();
                }
            });
        });
    }

    FoodListInsertCallBack(value: boolean) {
        this.isLoaded = true;
        this.loader.dismiss();
    }

    ionViewDidLoad() {
        this.searchControl.valueChanges.subscribe(search => {
            this.searching = false;
            this.setFilteredItems();
        });
    }
 
    OpenItemDetailsPage(product: FoodInfo) {

        var foodDetailInfo = {
            product: product,
            userId: this.userId
        };

        this.navCtrl.push(FoodDetailPage, foodDetailInfo);
    }

    setFilteredItems() {
        if (this.tempFoodList != null && this.searchTerm.length > 0) {
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