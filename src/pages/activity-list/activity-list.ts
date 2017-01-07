import { Component } from '@angular/core';
import { FittingoServiceApi, SqlStorageService } from '../shared/shared';
import { ActivityListInfo } from '../activity-list/ActivityListInfo';
import { NavParams } from 'ionic-angular';

import { ActivityInfo } from '../food-list/activityInfo';
import { LoadingController, Loading } from 'ionic-angular';
import { Network } from 'ionic-native';
import { IUserInfo } from '../login-page/userinfo';

@Component({
    selector: "ion-activity-list",
    templateUrl: "activity-list.html"
})

export class ActivityListPage {
    activityList: Array<ActivityInfo>;
    isLoaded: boolean = false;
    loading = false;
    userInfo: IUserInfo;
    loader: Loading;

    constructor(private api: FittingoServiceApi,
        private loadingController: LoadingController,
        private sqlService: SqlStorageService, private navParams: NavParams) {
        this.loading = true;
        this.loader = this.loadingController.create({
            content: 'Aktiviteler getiriliyor...',
        });
        this.userInfo = navParams.data;

        this.loader.present().then(() => {
            this.GetActivitiesFromLocal();
        });

    }

    GetActivitiesFromLocal() {
        this.sqlService.getAllActivityListToday(this.userInfo.userId).then(
            data => {
                if (data != null || data != undefined) {
                    this.activityList = data;
                    this.isLoaded = true;
                    this.loader.dismiss();
                }
            });
    }

    GetActivityList() {
        if (Network.connection != "none") {
            this.api.GetActivities().subscribe(data => {
                this.activityList = data;
                this.sqlService.InsertoReplaceActivities(data);
                this.GetActivitiesFromLocal();
            });
        } else {
            this.GetActivitiesFromLocal();
        }
    }
}