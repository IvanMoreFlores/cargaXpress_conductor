import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController, } from '@ionic/angular';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-cond-recuperar',
  templateUrl: './cond-recuperar.page.html',
  styleUrls: ['./cond-recuperar.page.scss'],
})
export class CondRecuperarPage implements OnInit {

  corre: String = '';
  constructor(public alertController: AlertController,
    public _login: LoginService,
    public loadingController: LoadingController,
    public NvCrtl: NavController) { }

  ngOnInit() {
  }

  async recuperar_contra() {
    if (this.corre.length > 0) {
      const loading = await this.loadingController.create({
        message: 'Espere...',
      });
      await loading.present();
      console.log(this.corre.length);
      this._login.recover_pass({ email: this.corre }).subscribe((data) => {
        console.log(data);
        loading.dismiss();
        this.successAlert('Se ha enviado un correo con las instrucciones al email ingresado.', 'Enviado');
      }, (err) => {
        loading.dismiss();
        this.errorAlert(err.error.msg);
      });
      // alert(1);
    } else {
      // alert(2);
      this.presentAlert();
    }
  }

  async successAlert(body: any, inf: any) {
    console.log('Mensaje : ' + body);
    this.loadingController.dismiss();
    const alert = await this.alertController.create({
      header: inf,
      backdropDismiss: false,
      subHeader: body,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.NvCrtl.navigateBack('/login');
            // this.navCtrl.navigateBack('/tabs/Conductores');
          }
        }
      ]
    });
    await alert.present();
  }

  async errorAlert(err: any) {
    this.loadingController.dismiss();
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Error',
      subHeader: 'error al recuperar contraseña',
      message: err,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: 'Campo incompleto',
      message: 'Ingrese su correo',
      buttons: ['OK']
    });

    await alert.present();
  }


}
