import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { HomePage } from '../pages/home-page/home-page';
import { LoginPage } from '../pages/login-page/login-page';
import { FittingoServiceApi, FoodService, SportService } from '../pages/shared/shared';

import { FoodListPage } from '../pages/food-list/food-list';
import { TabsPage } from '../pages/tabs/tabs';
import { FoodDetailPage } from '../pages/food-detail/food-detail';
import { SportListPage } from '../pages/sport-list/sport-list';
import { SportDetailPage } from '../pages/sport-detail/sport-detail';
import { SignUpPage } from '../pages/signup/signup';
import { ActivityListPage } from '../pages/activity-list/activity-list';
import { SqlStorageService, DataService } from '../pages/shared/shared';

import { Home } from '../pages/test/test';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    FoodListPage,
    TabsPage,
    FoodDetailPage,
    SportListPage,
    SportDetailPage,
    SignUpPage,
    ActivityListPage,
    Home
  ],
  imports: [
    IonicModule.forRoot(MyApp, { tabsPlacement: 'bottom' }),
    BrowserModule,
    FormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    FoodListPage,
    TabsPage,
    FoodDetailPage,
    SportListPage,
    SportDetailPage,
    SignUpPage,
    Home
  ],
  providers: [
    FoodService,
    FittingoServiceApi,
    SportService,
    SqlStorageService,
    DataService
  ]
})
export class AppModule { }
