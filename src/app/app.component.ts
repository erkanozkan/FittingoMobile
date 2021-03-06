import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, App } from 'ionic-angular';
import { StatusBar, Splashscreen, SQLite } from 'ionic-native';

import { LoginPage } from '../pages/login-page/login-page';
import { HomePage } from '../pages/home-page/home-page';
import { FoodListPage } from '../pages/food-list/food-list';
import { FoodDetailPage } from '../pages/food-detail/food-detail';
import { SportDetailPage } from '../pages/sport-detail/sport-detail';
import { ProfilePage } from '../pages/profile/profile';
import { ActivityListPage } from '../pages/activity-list/activity-list';

import { SqlStorageService } from '../pages/shared/shared';
import { WalkthroughPage } from '../pages/walkthrough/walkthrough';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = WalkthroughPage;

  pages: Array<{ title: string, icon: string, component: any }>;
  pushPages: Array<{ title: string, icon: string, component: any }>;

  constructor(public platform: Platform, public menu: MenuController,
    public sqlStorage: SqlStorageService, public app: App) {

    platform.ready().then(() => {
      StatusBar.styleDefault();
      setTimeout(() => {
        Splashscreen.hide();
      }, 1000);
      if (platform.is('cordova')) {
        sqlStorage.initializeDatabase();
      }
    });
    // used for an example of ngFor and navigation

    this.pages = [
      { title: 'Ana Sayfa', icon: 'home', component: HomePage }
    ];

    this.pushPages = [
      { title: 'Profil', icon: 'person', component: ProfilePage },
      { title: 'Aktiviteler', icon: 'list', component: ActivityListPage }
    ];
  }


  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }

  pushPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // rootNav is now deprecated (since beta 11) (https://forum.ionicframework.com/t/cant-access-rootnav-after-upgrade-to-beta-11/59889)
    this.app.getRootNav().push(page.component);
  }

  LogOut() {
    this.menu.close();
    this.nav.setRoot(LoginPage);
  }
}
