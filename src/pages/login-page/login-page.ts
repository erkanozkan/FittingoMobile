import { Component } from '@angular/core';
import { LoadingController, NavController,ToastController } from 'ionic-angular';
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
  userPassword: string;
  loading = false;

  constructor(public navCtrl: NavController,
    private service: FittingoServiceApi,
    private loadingController: LoadingController, private toastCtrl: ToastController) {
      this.username = "ozkn.erkan@gmail.com";
      this.userPassword="Erkan23?";
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
            this.presentToast("Hatalı email veya şifre girdiniz.")
        } else {
          this.userInfo = data
          this.navCtrl.setRoot(TabsPage,this.userInfo);          
        }
        loader.dismiss();
      });
    });
  }

     presentToast(message: string) {

        console.log(message);
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            cssClass: "toast"
        });
        toast.present();
    }

}