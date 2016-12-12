import { Component , OnInit} from '@angular/core';
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
        console.log("ngOnInit");
          this.sqlService.getAllActivityListToday().then(
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

 ionViewWillEnter() {
     console.log("ionViewWillEnter 1")
  }

   ionViewDidEnter() {
     console.log("ionViewDidEnter 1")
  }
   onPageDidEnter() {
     console.log("onPageDidEnter 1")
  }
   onPageWillEnter() {
     console.log("onPageWillEnter 1")
  }

     

    ionViewDidLoad() {
        console.log("ionViewDidLoad 1");

    } 
}