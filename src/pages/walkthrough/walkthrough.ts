import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';

import { LoginPage } from '../login-page/login-page';
import { SignUpPage } from '../signup/signup';

@Component({
  selector: 'walkthrough-page',
  templateUrl: 'walkthrough.html'
})
export class WalkthroughPage {

  slide_options = {
    pager: true
  };
  lastSlide = false;

  @ViewChild('slider') slider: Slides;

  constructor(public nav: NavController) {

  }

  skipIntro() {
    // You can skip to main app
    // this.nav.setRoot(TabsNavigationPage);

    // Or you can skip to last slide (login/signup slide)
    this.lastSlide = true;
    this.slider.slideTo(this.slider.length());
  }

  onSlideChanged() {
    // If it's the last slide, then hide the 'Skip' button on the header
    this.lastSlide = this.slider.isEnd();
  }

  goToLogin() {
    this.nav.push(LoginPage);
  }

  goToSignup() {
    this.nav.push(SignUpPage);
  }
}
