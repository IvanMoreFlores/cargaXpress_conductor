import { Component, OnInit } from '@angular/core';
import { Platform, AlertController, NavController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StorageService } from './../../services/storage/storage.service';
import { Events } from '@ionic/angular';

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
  constructor(private router: Router,
    public alertController: AlertController,
    public NvCtrl: NavController,
    private menu: MenuController,
    public _storage: StorageService,
    public events: Events) {
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

}
