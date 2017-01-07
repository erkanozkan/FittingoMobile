import { Component } from '@angular/core';
import { FittingoServiceApi, SqlStorageService } from '../shared/shared';
import { NavParams } from 'ionic-angular';

import { ActivityInfo } from '../food-list/activityInfo';
import { ActivityModel, EventModel } from '../activity-list/ActivityModel';

import { LoadingController, Loading, SegmentButton } from 'ionic-angular';
import { Network } from 'ionic-native';
import { IUserInfo } from '../login-page/userinfo';
import { ProductType } from '../shared/productType';

@Component({
    selector: "schedule-page",
    templateUrl: "activity-list.html"
})

export class ActivityListPage {
    activityList: Array<ActivityInfo>;
    activityModel: ActivityModel = new ActivityModel();

    isLoaded: boolean = false;
    loading = false;
    userInfo: IUserInfo;
    loader: Loading;
    segment: string;

    constructor(private api: FittingoServiceApi,
        private loadingController: LoadingController,
        private sqlService: SqlStorageService, private navParams: NavParams) {
        // this.userInfo = navParams.data;

        this.userInfo = this.api.userInfo;
        // this.userInfo = navParams.data;
    }

    ionViewDidLoad() {
        this.loading = true;
        this.loader = this.loadingController.create({
            content: 'Aktiviteler getiriliyor...',
        });
        this.segment = "today";

        this.loader.present().then(() => {
            this.GetActivitiesFromLocal();
        });
    }

    IsFoodOrExercise(productType: ProductType, itemProductType: ProductType) {
        return productType == itemProductType;
    }

    GetActivitiesFromLocal() {
        this.sqlService.getAllActivityListToday(this.userInfo.userId).then(
            data => {
                if (data != null || data != undefined) {
                    // this.activityList = data;
                    this.activityModel.today = data;
                    console.log("this.activityModel.today");

                    console.log(this.activityModel.today);
                    this.isLoaded = true;
                    this.loader.dismiss();
                }
            });

        this.sqlService.getAllActivityThisWeekly(this.userInfo.userId).then(
            data => {
                if (data != null || data != undefined) {
                    // this.activityList = data;
                    console.log("this.activityModel.week");
                    console.log(this.activityModel.week);

                    this.activityModel.week = data;

                    this.isLoaded = true;
                    this.loader.dismiss();
                }
            });
    }

    // GetActivityList() {
    //     if (Network.connection != "none") {
    //         this.api.GetActivities().subscribe(data => {
    //             this.activityList = data;
    //             this.sqlService.InsertoReplaceActivities(data);
    //             this.GetActivitiesFromLocal();
    //         });
    //     } else {
    //         this.GetActivitiesFromLocal();
    //     }
    // }

}