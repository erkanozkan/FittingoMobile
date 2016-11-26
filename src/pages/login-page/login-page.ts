import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { HomePage } from '../home-page/home-page';
import { FittingoServiceApi } from '../shared/shared';
import { IUserInfo } from '../login-page/userinfo';
import { TabsPage } from '../tabs/tabs';

@Component({
  templateUrl: 'login-page.html'
})

export class LoginPage {
  userInfo: IUserInfo;

  username: string;
  password: string;
  errorMessage: string;
  loading = false;

  constructor(public navCtrl: NavController,
    private service: FittingoServiceApi,
    private loadingController: LoadingController) {
    this.errorMessage = '';
  }

  login(form) {
    this.loading = true;
    let loader = this.loadingController.create({
      content: 'Giriş yapılıyor...',
      //spinner: 'dots'
    });
    loader.present().then(() => {
      this.service.Login(form.value.email, form.value.password).subscribe(data => {
        if (data.success == false) {
          this.errorMessage = 'Hatalı email veya şifre girdiniz.';
        } else {
          this.userInfo = data
          this.navCtrl.setRoot(TabsPage,this.userInfo);          
          //this.navCtrl.push(HomePage, this.userInfo);
        }
        loader.dismiss();

      });
    });
  }

}