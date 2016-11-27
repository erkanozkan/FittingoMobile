import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component'; 
import { FormsModule }   from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { HomePage } from '../pages/home-page/home-page';
import { LoginPage } from '../pages/login-page/login-page';
import { FittingoServiceApi , FoodService} from '../pages/shared/shared';

import { FormPage } from '../pages/form/form';
import { FoodListPage } from '../pages/food-list/food-list';
import { TabsPage } from '../pages/tabs/tabs';
import { FoodDetailPage } from '../pages/food-detail/food-detail';


@NgModule({
  declarations: [
    MyApp, 
    HomePage,
    LoginPage,
    FormPage,
    FoodListPage,
    TabsPage,
    FoodDetailPage
  ],
  imports: [
    IonicModule.forRoot(MyApp,{tabsPlacement: 'bottom'}),
     BrowserModule,
     FormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp, 
    HomePage,
    LoginPage,
    FormPage,
    FoodListPage,
    TabsPage,
    FoodDetailPage
      ],
  providers: [
    FoodService,
    FittingoServiceApi
  ]
})
export class AppModule {}
