import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component'; 
import { FormsModule }   from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { HomePage } from '../pages/home-page/home-page';
import { LoginPage } from '../pages/login-page/login-page';
import { FittingoServiceApi } from '../pages/shared/shared';
import { FormPage } from '../pages/form/form';
import { HeroFormComponent } from '../pages/hero/hero-form.component';
import { Food } from '../pages/food/food';
import { FoodListPage } from '../pages/food-list/food-list';


@NgModule({
  declarations: [
    MyApp, 
    HomePage,
    LoginPage,
    FormPage,
    HeroFormComponent,
    Food,
    FoodListPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
     BrowserModule,
     FormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp, 
    HomePage,
    LoginPage,
    FormPage,
    HeroFormComponent,
    Food,
    FoodListPage
  ],
  providers: [
    FittingoServiceApi,
    Food
  ]
})
export class AppModule {}
