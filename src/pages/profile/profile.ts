import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { counterRangeValidator } from '../../components/counter-input/counter-input';

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

  constructor(
    public nav: NavController,
    public modal: ModalController,
    public loadingCtrl: LoadingController,
    private navParams: NavParams, private service: FittingoServiceApi,
    private loadingController: LoadingController, private toastCtrl: ToastController,
    private sqlService: SqlStorageService
  ) {
    this.loading = this.loadingCtrl.create();
    console.log("girdi");
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

    // this.userInfo = <IUserInfo>{
    //   userId: 1,
    //   email: "string",
    //   name: "Erkan",
    //   success: true,
    //   password: "string",
    //   Weight: 89,
    //   RemainingCalorie: 1678,
    //   TakenCalorie: 1092,
    //   CalorieExpenditure: 1289,
    //   BadgeLevel: 129,
    //   GoalWater: 9,
    //   DailyWater: 7,
    //   DailyCalories: 1987,
    //   GoalWeight: 1234,
    //   WeeklyGoal: 554,
    //   GenderId: 1,
    //   ExerciseIntensityId: 2,
    //   Height: 178,
    //   UserImageURL: "http://www.fittingo.com/UserProfileImage/7a331cf93be344dab9cf711699a74e49.jpg"
    // };
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
  }

  SaveProfile() {

    this.userInfo.name = this.settingsForm.value.name;
    this.userInfo.RemainingCalorie = this.settingsForm.value.RemainingCalorie;
    this.userInfo.TakenCalorie = this.settingsForm.value.TakenCalorie;
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

    var age = this.userInfo.BirthYear - year;
    console.log("age");

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
    this.userInfo.RemainingCalorie = this.userInfo.DailyCalories - this.userInfo.TakenCalorie;

    console.log("userInfo");
    console.log(this.userInfo);

    this.sqlService.InsertUser(this.userInfo).then(data => {
      this.service.userInfo = this.userInfo;
      this.presentToast("Kullanıcı bilgileri başarılı şekilde update edildi.");
      this.nav.setRoot(HomePage);
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

