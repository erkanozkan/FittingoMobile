import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, SQLite } from 'ionic-native';

import { LoginPage } from '../pages/login-page/login-page';
import { HomePage } from '../pages/home-page/home-page';
import { FoodListPage } from '../pages/food-list/food-list';
import { SqlStorageService } from '../pages/shared/shared';
import { Home } from '../pages/test/test';
import { WalkthroughPage } from '../pages/walkthrough/walkthrough';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = WalkthroughPage;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public sqlStorage: SqlStorageService) {

    platform.ready().then(() => {
      StatusBar.styleDefault();
      if (platform.is('cordova')) {
        sqlStorage.initializeDatabase();
      }
    });
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Ana Sayfa', component: HomePage }
    ];
  }


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
