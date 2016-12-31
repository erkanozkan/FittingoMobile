import { Component } from '@angular/core';
import { SportService, SqlStorageService } from '../shared/shared';
import { FormControl } from '@angular/forms';
import { SportInfo } from '../sport-list/sportInfo';
import { ActivityInfo } from '../food-list/activityInfo';
import { NavController, NavParams } from 'ionic-angular';
import { SportDetailPage } from '../sport-detail/sport-detail';

import { LoadingController, ToastController } from 'ionic-angular';

@Component({
    selector:"sport-list-page",
    templateUrl: "sport-list.html"
})

export class SportListPage {
    searchTerm: string = '';
    searchControl: FormControl;
    sportList: Array<SportInfo>;
    tempSportList: Array<SportInfo>;
    searching: any = false;
    isLoaded: boolean = false;
    loading = false;
    userId: number;
    success: boolean;
    productItem: SportInfo;
    canDoRequest: boolean = false;
    Weight: number;

    constructor(private navCtrl: NavController,
        private dataService: SportService,
        private loadingController: LoadingController,
        private navParams: NavParams, private toastCtrl: ToastController,
        private sqlService: SqlStorageService) {

        this.userId = this.navParams.data.userId;
        this.Weight = this.navParams.data.Weight;

        this.searchControl = new FormControl();

        this.loading = true;
        let loader = this.loadingController.create({
            content: 'Spor kategorileri getiriliyor...',
        });
        loader.present().then(() => {
            sqlService.getAllExerciseList().then(data => {
                if (data == null || data.length == 0) {
                    dataService.GetAllSportList().subscribe(data => {
                        this.tempSportList = data;
                        this.sportList = data;
                        loader.setContent("Spor kategorileri kaydediliyor...")
                        this.sqlService.BulkInsertExercises(this.tempSportList);
                        this.isLoaded = true;
                        loader.dismiss();
                    });
                } else {
                    this.tempSportList = data;
                    this.sportList=data;
                    this.isLoaded = true;
                    loader.dismiss();
                }
            })
        });
    }
    ionViewDidLoad() {
        this.searchControl.valueChanges.subscribe(search => {
            this.searching = false;
            this.setFilteredItems();
        });
    }
 
    OpenItemDetailsPage(product: SportInfo) {
        var sportDetailInfo = {
            product: product,
            userId: this.userId,
            Weight: this.Weight
        };

        this.navCtrl.push(SportDetailPage, sportDetailInfo);
    }

    setFilteredItems() {
        if (this.tempSportList != null && this.searchTerm.length > 0) {
            this.sportList = this.tempSportList.filter((item) => {
                this.canDoRequest = true;
                return item.ExerciseName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
            });
        } else {
            this.canDoRequest = false;
            this.sportList = null;
        }
    }
}