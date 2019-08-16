import { Component, OnInit } from '@angular/core';
import { Platform, AlertController, NavController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StorageService } from './../../services/storage/storage.service';
import { Events } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  profile: any;
  user: String = '';
  messages: any[] = [];
  subscription: Subscription;
  text = 'visita CargaXpress y vive la mejor experiencia!';
  url = 'https://cargaxpress-dev.mybluemix.net/';
  constructor(private router: Router,
    public alertController: AlertController,
    public NvCtrl: NavController,
    private menu: MenuController,
    public _storage: StorageService,
    public events: Events,
    public actionSheetController: ActionSheetController,
    private socialSharing: SocialSharing,
    private file: File) {
    this.events.subscribe('user', (data) => {
      console.log('user ' + data);
      this.user = data;
    });
  }

  ngOnInit() {
    if (!this.user) {
      this.user = localStorage.getItem('name');
    }
  }

  cerrar_session() {
    this.NvCtrl.navigateRoot('/cond-splash');
  }

  async AlertCerrar() {
    this.menu.close('custom');
    const alert = await this.alertController.create({
      header: 'Cerrar sessión',
      message: 'Desea cerrar sessión?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.menu.close('custom');
          }
        }, {
          text: 'Si',
          handler: () => {
            localStorage.clear();
            this.cerrar_session();
          }
        }
      ]
    });
    await alert.present();
  }

  async presentSharing() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Compartir',
      backdropDismiss: false,
      buttons: [{
        text: 'Twitter',
        icon: 'logo-twitter',
        handler: () => {
          console.log('Twitter clicked');
          this.shareTwitter();
        }
      }, {
        text: 'Email',
        icon: 'at',
        handler: () => {
          console.log('Email clicked');
          this.shareEmail();
        }
      }, {
        text: 'Facebook',
        icon: 'logo-facebook',
        handler: () => {
          console.log('Facebook clicked');
          this.shareFacebook();
        }
      }, {
        text: 'WhatsApp',
        icon: 'logo-whatsapp',
        handler: () => {
          console.log('WhatsApp clicked');
          this.shareWhatsApp();
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async shareTwitter() {
    // Either URL or Image
    this.socialSharing.shareViaTwitter(null, null, this.url).then(() => {
      // Success
    }).catch((e) => {
      // Error!
    });
  }

  async shareWhatsApp() {
    const file = await this.resolveLocalFile();
    // Text + Image or URL works
    this.socialSharing.shareViaWhatsApp(this.text, file.nativeURL, this.url).then(() => {
      // Success
    }).catch((e) => {
      // Error!
    });
  }

  async resolveLocalFile() {
    return this.file.copyFile(`${this.file.applicationDirectory}www/assets/img/`, 'icon.png',
      this.file.cacheDirectory, `${new Date().getTime()}.png`);
  }

  removeTempFile(name) {
    this.file.removeFile(this.file.cacheDirectory, name);
  }

  async shareEmail() {
    const file = await this.resolveLocalFile();
    this.socialSharing.shareViaEmail(this.text, 'CargaXpress', ['ivanyoe79@gmail.com'], null, null, file.nativeURL).then(() => {
      this.removeTempFile(file.name);
    }).catch((e) => {
      // Error!
    });
  }

  async shareFacebook() {
    const file = await this.resolveLocalFile();
    // Image or URL works
    this.socialSharing.shareViaFacebook(null, null, this.url).then(() => {
      this.removeTempFile(file.name);
    }).catch((e) => {
      // Error!
    });
  }


}
