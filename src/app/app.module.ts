import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { HomePage } from '../pages/home-page/home-page';
import { LoginPage } from '../pages/login-page/login-page';
import { FittingoServiceApi, FoodService, SportService, SqlStorageService } from '../pages/shared/shared';
import { WalkthroughPage } from '../pages/walkthrough/walkthrough';


import { PreloadImage } from '../components/preload-image/preload-image';
import { BackgroundImage } from '../components/background-image/background-image';
import { ShowHideContainer } from '../components/show-hide-password/show-hide-container';
import { ShowHideInput } from '../components/show-hide-password/show-hide-input';
import { ColorRadio } from '../components/color-radio/color-radio';
import { CounterInput } from '../components/counter-input/counter-input';
import { Rating } from '../components/rating/rating';


import { FoodListPage } from '../pages/food-list/food-list';
import { TabsPage } from '../pages/tabs-navigation/tabs-navigation';
import { FoodDetailPage } from '../pages/food-detail/food-detail';
import { SportListPage } from '../pages/sport-list/sport-list';
import { SportDetailPage } from '../pages/sport-detail/sport-detail';
import { SignUpPage } from '../pages/signup/signup';
import { ActivityListPage } from '../pages/activity-list/activity-list';
import { ProfilePage } from '../pages/profile/profile';

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
    PreloadImage,
    BackgroundImage,
    ShowHideContainer,
    ShowHideInput,
    ColorRadio,
    CounterInput,
    Rating,
    WalkthroughPage,
    ProfilePage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      tabsPlacement: 'bottom',
      backButtonText: 'Geri'
    }),
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
    WalkthroughPage,
    ProfilePage,
    ActivityListPage
  ],
  providers: [
    FoodService,
    FittingoServiceApi,
    SportService,
    SqlStorageService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
