import { OnInit, Component } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { TabsPage } from '../tabs/tabs';
import { LoadingController, NavController, ToastController } from 'ionic-angular';
import { FittingoServiceApi } from '../shared/shared';
import { SignUpPage } from '../signup/signup';

@Component({
  templateUrl: 'login-page.html'
})
export class LoginPage implements OnInit {
  myForm: FormGroup;
  loading = false;
  userInfo: { password: string, email: string } = { password: '', email: '' };

  constructor(public formBuilder: FormBuilder, public navCtrl: NavController,
    private service: FittingoServiceApi,
    private loadingController: LoadingController, private toastCtrl: ToastController) {
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
      this.service.Login(this.myForm.value.email, this.myForm.value.password).subscribe(data => {
        if (data.success == false) {
          this.presentToast("Hatalı email veya şifre girdiniz.")
        } else {
          this.userInfo = data
          this.navCtrl.setRoot(TabsPage, this.userInfo);
        }
        loader.dismiss();
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
    console.log(message);
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      cssClass: "toast"
    });
    toast.present();
  }

  phoneValidator(control: FormControl): { [s: string]: boolean } {
    if (control.value !== '') {
      if (!control.value.match('\\(?\\d{3}\\)?-? *\\d{3}-? *-?\\d{4}')) {
        return { invalidPhone: true };
      }
    }
  }

  emailValidator(control: FormControl): { [s: string]: boolean } {
    if (!(control.value.toLowerCase().match('^[a-zA-Z0-9+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$'))) {
      return { invalidEmail: true };
    }
  }
}