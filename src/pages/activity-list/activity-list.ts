import { Component, OnInit } from '@angular/core';
import { FittingoServiceApi, SqlStorageService } from '../shared/shared';
import { ActivityListInfo } from '../activity-list/ActivityListInfo';

import { ActivityInfo } from '../food-list/activityInfo';
import { LoadingController } from 'ionic-angular';

@Component({
    selector: "ion-activity-list",
    templateUrl: "activity-list.html"
})

export class ActivityListPage extends OnInit {
    activityList: Array<ActivityInfo>;
    isLoaded: boolean = false;
    loading = false;

    constructor(private dataService: FittingoServiceApi,
        private loadingController: LoadingController,
        private sqlService: SqlStorageService) {
        super();
    }

    ngOnInit() {
        this.sqlService.getAllActivityListToday(this.dataService.userInfo.userId).then(
            data => {
                if (data != undefined || data != null || data.length != 0) {
                    this.activityList = data;
                    this.isLoaded = true;

                } else {
                    this.dataService.GetActivities().subscribe(data => {
                        this.activityList = data;
                    });
                    this.isLoaded = true;
                }
            });
    }
}