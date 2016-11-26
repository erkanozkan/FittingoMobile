import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { IUserInfo } from '../login-page/userinfo';
import { HomePage } from '../home-page/home-page';


@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    tab1Root: any = HomePage;
    userInfo: IUserInfo;

    constructor(private navCtrl: NavController,
        private navParams: NavParams) {
        this.userInfo = navParams.data;
        console.log(this.userInfo);
    }
}