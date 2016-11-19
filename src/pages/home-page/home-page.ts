import {Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { IUserInfo } from '../login-page/userinfo'; 

@Component({
 templateUrl: 'home-page.html'
})

export class HomePage{
    userInfo: IUserInfo;
 constructor(public nav: NavController, private navParams : NavParams){
     this.userInfo = navParams.data;
     console.log(this.navParams);
 }
}