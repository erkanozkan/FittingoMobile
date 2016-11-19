import { Component , Input} from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { HomePage } from '../home-page/home-page';
import { FittingoServiceApi } from '../shared/shared';
import { IUserInfo } from '../login-page/userinfo'; 

@Component({
  templateUrl: 'login-page.html'
})

export class LoginPage {
 userInfo : IUserInfo;
 @Input() userName: string
 @Input() password: string
  constructor(public navCtrl: NavController, 
  private service : FittingoServiceApi,
  private loadingController : LoadingController) {
    
  }

    login(userName, password){
      let loader = this.loadingController.create({
          content : 'Giriş yapılıyor...',
          //spinner: 'dots'
      });


      loader.present().then(()=> {
      this.service.Login(userName,password).subscribe(data=> {
        this.userInfo = data
        loader.dismiss();
          this.navCtrl.push(HomePage,this.userInfo);
      }); 
  });
    }
 
}