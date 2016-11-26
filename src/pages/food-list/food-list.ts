import { Component } from '@angular/core';

import { FoodService } from '../shared/shared';

import { FormControl } from '@angular/forms';

import { FoodInfo } from '../food-list/foodInfo';
import { LoadingController } from 'ionic-angular';

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

    constructor(private dataService: FoodService, private loadingController: LoadingController) {
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
        if(this.searchTerm.length > 2){
        this.searching = true;
        }
    }
    setFilteredItems() {
        if (this.tempFoodList != null && this.searchTerm.length > 2) {
            this.foodList = this.tempFoodList.filter((item) => {
                return item.ProductName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
            });
        }else{
              this.foodList = null;
        }
    }
}