import { OnInit, Component } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { FittingoServiceApi } from '../shared/shared';
import { LoadingController, NavController, ToastController } from 'ionic-angular';
import { LoginPage } from '../login-page/login-page';
import { ResponseBase } from '../shared/shared';
import { Network } from 'ionic-native';

@Component({
  selector: "signup-page",
  templateUrl: 'signup.html'
})
export class SignUpPage implements OnInit {
  myForm: FormGroup;
  responseBase: ResponseBase;

  constructor(public formBuilder: FormBuilder, private api: FittingoServiceApi,
    private loadingController: LoadingController, private toastCtrl: ToastController,
    public navCtrl: NavController) {

  }

  ngOnInit(): any {
    this.myForm = this.formBuilder.group({
      'name': ['', [Validators.required, Validators.minLength(3), this.nameValidator.bind(this)]],
      'surname': ['', [Validators.required, Validators.minLength(3), this.nameValidator.bind(this)]],
      //'password': ['', [Validators.required, Validators.minLength(3), this.matchPasswordValidator.bind(this)]],
      //'confirm_password': ['', [Validators.required, Validators.minLength(3), this.matchConfirmPasswordValidator.bind(this)]],
      'passwords': this.formBuilder.group({
        password: new FormControl('', Validators.required),
        confirmPassword: new FormControl('', Validators.required)
      }, { validator: this.areEqual.bind(this)}),
      'email': ['', [Validators.required, this.emailValidator.bind(this)]]
    });
  }
  areEqual(group: FormGroup) {
    let password = group.controls["password"];
    let confirmPassword = group.controls["confirmPassword"];

    console.log("password " + password.value);
    console.log("confirmPassword " + confirmPassword.value);
    if (password.value != confirmPassword.value) {
      return { invalidpassword: true };
    } 
  }
  doSignup() {
    if (Network.connection == "none") {
      this.presentToast("Lütfen internet bağlantınızı kontrol edin.");
    } else {
      this.api.CreateAccount(this.myForm.value.email, this.myForm.value.name,
        this.myForm.value.surname, this.myForm.value.password).subscribe(data => {
          this.responseBase = data;
          if (this.responseBase != null) {

            if (this.responseBase.success) {
              this.presentToast("Kayıt başarılı.");
              this.navCtrl.push(LoginPage);
            } else {
              this.presentToast(this.responseBase.message);
            }

          } else {
            this.presentToast("Kayıt başarısız.");
          }
        })
    }
  }

  isValid(field: string) {
    let formField = this.myForm.get(field);
    return formField.valid || formField.pristine;
  }

  presentToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      cssClass: "toast"
    });
    toast.present();
  }


  nameValidator(control: FormControl): { [s: string]: boolean } {
    if (!control.value.match("^[a-zA-Zçğıöşü ,.'-]+$")) {
      return { invalidName: true };
    }
  }

  emailValidator(control: FormControl): { [s: string]: boolean } {
    if (!(control.value.toLowerCase().match('^[a-zA-Z0-9+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$'))) {
      return { invalidEmail: true };
    }
  }
}