import { OnInit, Component } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { TabsPage } from '../tabs-navigation/tabs-navigation';
import { LoadingController, NavController, ToastController, Platform } from 'ionic-angular';
import { FittingoServiceApi, SqlStorageService } from '../shared/shared';
import { SignUpPage } from '../signup/signup';
import { IUserInfo } from '../login-page/userinfo';
import { Observable } from 'rxjs/Observable';
import { Network } from 'ionic-native';
declare var Connection: any;

@Component({
  selector:"login-page",
  templateUrl: 'login-page.html'
})
export class LoginPage implements OnInit {
  login: FormGroup;
  loading = false;
  userInfo: IUserInfo;

  constructor(public formBuilder: FormBuilder, public navCtrl: NavController,
    private service: FittingoServiceApi,
    private loadingController: LoadingController, private toastCtrl: ToastController
    , private platform: Platform, private sqlService: SqlStorageService) {

    this.userInfo = <IUserInfo>{
      email: "ozkn.erkan@gmail.com",
      password: "Erkan23?",
      success: false
    };
  }

  ngOnInit(): any {
    this.login = this.formBuilder.group({
      'password': ['', [Validators.required, Validators.minLength(3)]],
      'email': ['', [Validators.required, this.emailValidator.bind(this)]]
    });
  }

  doLogin() {
    this.loading = true;
    let loader = this.loadingController.create({
      content: 'Giriş yapılıyor...',
      //spinner: 'dots'
    });

    loader.present().then(() => {
      this.sqlService.getUser(this.login.value.email, this.login.value.password)
        .then(data => {
          console.log("sqlService.getUser");
          console.log(data);
          if (data != undefined && data != null) {
            this.userInfo = <IUserInfo>{
              userId: data.userId,
              email: data.email,
              name: data.name,
              Weight: data.Weight,
              RemainingCalorie: data.RemainingCalorie,
              BadgeLevel: data.BadgeLevel,
              DailyCalories: data.DailyCalories,
              GoalWater: data.GoalWater,
              DailyWater: data.DailyWater,
              TakenCalorie: data.TakenCalorie,
              CalorieExpenditure: data.CalorieExpenditure,
              password:data.password,
              success: true
            };
            this.service.userInfo = this.userInfo;
                    
            this.navCtrl.setRoot(TabsPage, this.userInfo);
            loader.dismiss();
          } else {

            if (Network.connection != 'none') {
              this.service.Login(this.login.value.email, this.login.value.password)
                .subscribe(data => {
                  console.log("service.Login");
                  console.log(this.userInfo);
                  this.userInfo = data;

                  if (this.userInfo == null || this.userInfo.success == false) {
                    this.presentToast("Hatalı email veya şifre girdiniz.");
                  } else {
                    this.sqlService.InsertUser(this.userInfo);
                    this.service.userInfo = this.userInfo;
                    this.navCtrl.setRoot(TabsPage, this.userInfo);
                  }
                  loader.dismiss();
                });
            } else {
              this.presentToast("İnternet bağlantınızı kontrol edin.");
              loader.dismiss();
            }

          }
        });
    });
  }

goToForgotPassword() {

}
  isValid(field: string) {
    let formField = this.login.get(field);
    return formField.valid || formField.pristine;
  }

  OpenSignupPage() {
    this.navCtrl.push(SignUpPage);
  }
  presentToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      cssClass: "toast"
    });
    toast.present();
  }


  emailValidator(control: FormControl): { [s: string]: boolean } {
    if (!(control.value.toLowerCase().match('^[a-zA-Z0-9+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$'))) {
      return { invalidEmail: true };
    }
  }
}