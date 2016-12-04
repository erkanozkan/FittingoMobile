import { Component } from '@angular/core';
import { FittingoServiceApi } from '../shared/shared';
import { ActivityListInfo } from '../activity-list/ActivityListInfo';

import { LoadingController } from 'ionic-angular';

@Component({
    selector: "ion-activity-list",
    templateUrl: "activity-list.html"
})

export class ActivityListPage {
    activityList: Array<ActivityListInfo>;
    isLoaded: boolean = false;
    loading = false;

    constructor(private dataService: FittingoServiceApi,
        private loadingController: LoadingController) {
        dataService.GetActivities().subscribe(data => this.activityList = data);
        this.isLoaded = true;
    }
}