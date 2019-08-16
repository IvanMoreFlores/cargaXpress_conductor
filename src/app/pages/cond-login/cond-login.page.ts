import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, LoadingController, Platform } from '@ionic/angular';
import { MenuController, IonRouterOutlet, AlertController } from '@ionic/angular';
import { StorageService } from '../../services/storage/storage.service';
import { Subscription, from } from 'rxjs';
import { FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Events } from '@ionic/angular';
import { ViewChild, ElementRef } from '@angular/core';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-cond-login',
  templateUrl: './cond-login.page.html',
  styleUrls: ['./cond-login.page.scss'],
})
export class CondLoginPage {
  // private formularioUsuario: FormGroup;
  formularioUsuario: FormGroup;
  @ViewChild(IonRouterOutlet, { static: false }) routerOutlet: IonRouterOutlet;
  customBackActionSubscription: Subscription;
  type: String = 'password';
  icono: String = 'eye';
  data: any = {
    email: null,
    password: null
  };
  constructor(private router: Router,
    private menu: MenuController,
    public _login: LoginService,
    public _storage: StorageService,
    public alertController: AlertController,
    public NvCtrl: NavController,
    public loadingController: LoadingController,
    public platform: Platform,
    public fb: FormBuilder,
    private events: Events,
    public navCtrl: NavController) {
    this.formularioUsuario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  recover() {
    // this.platform.backButton.unsubscribe();
    this.router.navigateByUrl('/cond-recuperar');
  }

  async login() {
    const loading = await this.loadingController.create({
      message: 'Espere por favor',
    });
    await loading.present();
    this._login.login(this.data).subscribe((data => {
      // loading.dismiss();
      // console.log('Bien');
      // console.log(data);
      if (data.user.profile._id !== 4) {
        loading.dismiss();
        this.respuestaFail('Debe ingresar una cuenta de tipo CHOFER');
      } else {
        this._storage.guardar_session(data);
        loading.dismiss();
        this.router.navigateByUrl('/cond-tabs/Home');
      }

      // this._storage.guardar_session(data);
      // this.home(data);
    }), error => {
      console.log('Error');
      console.log(error.error);
      loading.dismiss();
      this.respuestaFail(error.error);
    });
  }
  async respuestaFail(error: any) {
    this.loadingController.dismiss();
    if (error.msg) {
      this.loadingController.dismiss();
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: 'Error',
        subHeader: 'Datos erroneos',
        message: error.msg,
        buttons: ['OK']
      });
      await alert.present();
    } else {
      this.loadingController.dismiss();
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: 'Error',
        subHeader: 'Datos erroneos',
        message: error,
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  type_password() {
    if (this.type === 'text') {
      this.icono = 'eye';
      this.type = 'password';
    } else {
      this.icono = 'eye-off';
      this.type = 'text';
    }
  }

  ionViewDidEnter() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      } else if (this.router.url === '/cond-login') {
        // this.cerrar();
        // or if that doesn't work, try
        // tslint:disable-next-line: no-string-literal
        navigator['app'].exitApp();
      } else {
        this.navCtrl.pop();
        // this.generic.showAlert("Exit", "Do you want to exit the app?", this.onYesHandler, this.onNoHandler, "backPress");
      }
    });
  }

  // ionViewWillLeave() {
  //   // alert('ionViewWillLeave: cond-login ');
  //   this.platform.backButton.unsubscribe();
  // }

}
