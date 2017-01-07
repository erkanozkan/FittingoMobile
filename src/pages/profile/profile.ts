import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { counterRangeValidator } from '../../components/counter-input/counter-input';
import { Network } from 'ionic-native';

import { WalkthroughPage } from '../walkthrough/walkthrough';

import { HomePage } from '../home-page/home-page';
import { IUserInfo } from '../login-page/userinfo';
import { FittingoServiceApi, SqlStorageService } from '../shared/shared';

import 'rxjs/Rx';

@Component({
  selector: 'profile-page',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  settingsForm: FormGroup;
  // make WalkthroughPage the root (or first) page
  rootPage: any = WalkthroughPage;
  loading: any;
  userInfo: IUserInfo;
  userImageUrl: string;
  constructor(
    public nav: NavController,
    public modal: ModalController,
    public loadingCtrl: LoadingController,
    private navParams: NavParams, private service: FittingoServiceApi,
    private loadingController: LoadingController, private toastCtrl: ToastController,
    private sqlService: SqlStorageService
  ) {
    this.loading = this.loadingCtrl.create();
    this.settingsForm = new FormGroup({
      name: new FormControl(""),
      email: new FormControl(""),
      RemainingCalorie: new FormControl(0),
      TakenCalorie: new FormControl(0),
      GoalWater: new FormControl(1, counterRangeValidator(20, 1)),
      WeeklyGoal: new FormControl(0),
      GoalWeight: new FormControl(0),
      GenderId: new FormControl(1),
      ExerciseIntensityId: new FormControl(1),
      Height: new FormControl(0),
      Weight: new FormControl(0)
    });
    this.userInfo = navParams.data;

    this.settingsForm.setValue({
      name: this.userInfo.name,
      email: this.userInfo.email,
      RemainingCalorie: this.userInfo.RemainingCalorie,
      TakenCalorie: this.userInfo.TakenCalorie,
      GoalWater: this.userInfo.GoalWater,
      GoalWeight: this.userInfo.GoalWeight,
      WeeklyGoal: this.userInfo.WeeklyGoal,
      GenderId: this.userInfo.GenderId,
      ExerciseIntensityId: this.userInfo.ExerciseIntensityId,
      Height: this.userInfo.Height,
      Weight: this.userInfo.Weight
    });
    if (Network.connection == 'none') {
      if (this.userInfo.GenderId == 1) {
        this.userImageUrl = "assets/images/men.png";
      } else {
        this.userImageUrl = "assets/images/women.png";
      }
    } else {
      this.userImageUrl = this.userInfo.UserImageURL;
    }
  }

  SaveProfile() {

    this.userInfo.name = this.settingsForm.value.name;
    this.userInfo.GoalWater = this.settingsForm.value.GoalWater;
    this.userInfo.GoalWeight = this.settingsForm.value.GoalWeight;
    this.userInfo.WeeklyGoal = this.settingsForm.value.WeeklyGoal;
    this.userInfo.GenderId = this.settingsForm.value.GenderId;
    this.userInfo.ExerciseIntensityId = this.settingsForm.value.ExerciseIntensityId;
    this.userInfo.Height = this.settingsForm.value.Height;
    this.userInfo.Weight = this.settingsForm.value.Weight;
    this.userInfo.IsUserSynced = 0;

    var date = new Date();
    var year = date.getFullYear();

    var age = year - this.userInfo.BirthYear;
    if (age < 0) {
      age = 0;
    }

    if (this.userInfo.GenderId == 1) {
      this.userInfo.DailyCalories =
        66.5 +
        (13.75 * this.userInfo.Weight) +
        (5.003 * this.userInfo.Height) -
        (6.775 * age);
    } else {
      this.userInfo.DailyCalories = 655.1 +
        (9.563 * this.userInfo.Weight) +
        (1.850 * this.userInfo.Height) -
        (4.676 * age);
    }
    switch (this.userInfo.ExerciseIntensityId) {
      case 1: this.userInfo.DailyCalories = this.userInfo.DailyCalories * 1.2; break;
      case 2: this.userInfo.DailyCalories = this.userInfo.DailyCalories * 1.3; break;
      case 3: this.userInfo.DailyCalories = this.userInfo.DailyCalories * 1.4; break;
      case 4: this.userInfo.DailyCalories = this.userInfo.DailyCalories * 1.5; break;
      case 5: this.userInfo.DailyCalories = this.userInfo.DailyCalories * 1.6; break;
    }

    var dietPlan = this.userInfo.WeeklyGoal;

    if (this.userInfo.Weight < this.userInfo.GoalWeight * 1)
      dietPlan = -1 * dietPlan;
    else if (this.userInfo.Weight == this.userInfo.GoalWeight * 1)
      dietPlan = 0;

    this.userInfo.DailyCalories = Math.floor(this.userInfo.DailyCalories - dietPlan);
    this.userInfo.RemainingCalorie = this.userInfo.DailyCalories - this.userInfo.TakenCalorie;

    this.sqlService.InsertUser(this.userInfo).then(data => {
      this.service.userInfo = this.userInfo;
      this.presentToast("Kullanıcı bilgileri başarılı şekilde update edildi.");
    });
  }

  presentToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      cssClass: "toast"
    });
    toast.present();
  }
}

