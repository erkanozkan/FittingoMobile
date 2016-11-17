import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home-page/home-page';
 
@Component({
  selector: 'page-login',
  templateUrl: 'login-page.html',
})
export class LoginPage {
 
  constructor(public navCtrl: NavController) {
    
  }

    login(){
          this.navCtrl.setRoot(HomePage);
      }
 
}