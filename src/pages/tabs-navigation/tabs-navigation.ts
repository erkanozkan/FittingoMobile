import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { IUserInfo } from '../login-page/userinfo';
import { HomePage } from '../home-page/home-page';
import { ProfilePage } from '../profile/profile';


@Component({
    selector: "tabs-navigation",
    templateUrl: 'tabs-navigation.html'
})
export class TabsPage {
    tab1Root: any;
    tab2Root: any;
    userInfo: IUserInfo;

    constructor(private navCtrl: NavController,
        private navParams: NavParams) {

        this.tab1Root = HomePage;
        this.tab2Root = ProfilePage;
        this.userInfo = navParams.data;
    }
}