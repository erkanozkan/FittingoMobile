import { OnInit, Component } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { TabsPage } from '../tabs/tabs';
import { LoadingController, NavController, ToastController, Platform } from 'ionic-angular';
import { FittingoServiceApi, SqlStorageService, DataService } from '../shared/shared';
import { SignUpPage } from '../signup/signup';
import { IUserInfo } from '../login-page/userinfo';
import { Observable } from 'rxjs/Observable';
import { Network } from 'ionic-native';
declare var Connection: any;

@Component({
  templateUrl: 'login-page.html'
})
export class LoginPage implements OnInit {
  myForm: FormGroup;
  loading = false;
  userInfo: IUserInfo;

  constructor(public formBuilder: FormBuilder, public navCtrl: NavController,
    private service: FittingoServiceApi,
    private loadingController: LoadingController, private toastCtrl: ToastController
    , private platform: Platform, private sqlService: SqlStorageService,
    private dataService: DataService) {

    this.userInfo = <IUserInfo>{
      email: "ozkn.erkan@gmail.com",
      password: "Erkan23?",
      success: false
    };
  }

  ngOnInit(): any {
    this.myForm = this.formBuilder.group({
      'password': ['', [Validators.required, Validators.minLength(3)]],
      'email': ['', [Validators.required, this.emailValidator.bind(this)]]
    });
  }

  onSubmit() {
    this.loading = true;
    let loader = this.loadingController.create({
      content: 'Giriş yapılıyor...',
      //spinner: 'dots'
    });

    loader.present().then(() => {
      this.sqlService.getUser(this.myForm.value.email, this.myForm.value.password)
        .then(data => {
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
                    
            console.log("sql user: " +this.userInfo.name);
            this.navCtrl.setRoot(TabsPage, this.userInfo);
            loader.dismiss();
          } else {

            if (Network.connection != 'none') {
              this.service.Login(this.myForm.value.email, this.myForm.value.password)
                .subscribe(data => {
                  this.userInfo = data;
                console.log("service user: " +this.userInfo);

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

  isValid(field: string) {
    let formField = this.myForm.get(field);
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