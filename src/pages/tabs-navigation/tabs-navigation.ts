import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { IUserInfo } from '../login-page/userinfo';
import { HomePage } from '../home-page/home-page';


@Component({
    selector:"tabs-navigation",
    templateUrl: 'tabs-navigation.html'
})
export class TabsPage {
    tab1Root: any = HomePage;
    userInfo: IUserInfo;
    HideTab: boolean = true;

    constructor(private navCtrl: NavController,
        private navParams: NavParams) {
        
        this.userInfo = navParams.data;

    }
}