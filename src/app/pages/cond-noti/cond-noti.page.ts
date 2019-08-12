import { Component, OnInit } from '@angular/core';
import {  ModalController, IonRouterOutlet, Platform } from '@ionic/angular';
import { MenuController, NavController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NotificacionService } from '../../services/notificacion/notificacion.service';
// import { VerMasPage } from '../ver-mas/ver-mas.page';
import { ToastController } from '@ionic/angular';
import { ViewChild, ElementRef } from '@angular/core';
import { Subscription, from } from 'rxjs';

@Component({
  selector: 'app-cond-noti',
  templateUrl: './cond-noti.page.html',
  styleUrls: ['./cond-noti.page.scss'],
})
export class CondNotiPage implements OnInit {
  sin_datos: Boolean = true;
  con_datos: Boolean = false;
  cero_datos: Boolean = false;
  notificaciones: any[] = [];
  page: number;
  // ngStyle: string = '--background:white';
  ngStyle: { 'background': 'white !important'; };
  @ViewChild(IonRouterOutlet, { static: false }) routerOutlet: IonRouterOutlet;
  customBackActionSubscription: Subscription;
  constructor(private menu: MenuController,
    public NvCtrl: NavController,
    public router: Router,
    public _noti: NotificacionService,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastController: ToastController,
    public platform: Platform) { }

  ngOnInit() {
    this.menu.swipeGesture(false, 'custom');
    this.listarNotifiaciones();
  }

  openFirst() {
    this.menu.open('custom');
  }


  listarNotifiaciones() {
    this._noti.listar_notificaciones().subscribe((data => {
      if (data.notifications.length > 0) {
        this.page = data.page;
        this.notificaciones = data.notifications;
        this.cero_datos = false;
        this.con_datos = true;
        this.sin_datos = false;
      } else {
        this.cero_datos = true;
        this.sin_datos = false;
      }
    }), error => {
      this.respuestaFail(error.error);
    });
  }

  async abrir_modal(notificacion: any) {
    // this._noti.leer_notificacion(notificacion._id).subscribe((async data => {
    //   if (notificacion.message === 'Han realizado una contraoferta.') {
    //     const modal = await this.modalController.create({
    //       component: VerMasPage,
    //       componentProps: { id: notificacion.types[1]['id'], id_oferta: notificacion.types[0]['id'] }
    //     });
    //     modal.onWillDismiss().then(() => {
    //       this.refrescar();
    //     });
    //     return await modal.present();
    //   } else {
    //     this.router.navigate(['/detail', notificacion.types[0]['id']]);
    //   }
    // }));
  }

  doRefresh(event: any) {
    this.cero_datos = false;
    this.sin_datos = true;
    this.con_datos = false;
    setTimeout(() => {
      this.listarNotifiaciones();
      event.target.complete();
    }, 2000);
  }

  siguiente(event) {
    this._noti.listar_notificaciones_page(this.page + 1).subscribe((data => {
      if (data.notifications.length > 0) {
        this.page = data.page;
        this.notificaciones = this.notificaciones.concat(data.notifications);
        event.target.complete();
      } else {
        event.target.complete();
        this.presentToast();
      }
    }), error => {
      this.respuestaFail(error.error);
    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Sin datos que mostrar',
      duration: 2000
    });
    toast.present();
  }

  async respuestaFail(error: any) {
    if (error.msg) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: error.msg,
        buttons: ['OK']
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Falla al intentar comunicarse con el servidor',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  ionViewDidEnter() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      } else if (this.router.url === '/cond-tabs/Notificaciones') {
        // this.cerrar();
        // or if that doesn't work, try
        // tslint:disable-next-line: no-string-literal
        this.menu.isOpen().then((data) => {
          console.log(data);
          if (data === true) {
            this.menu.close('custom');
          } else {
            navigator['app'].exitApp();
          }
        });
      } else {
        // this.generic.showAlert("Exit", "Do you want to exit the app?", this.onYesHandler, this.onNoHandler, "backPress");
      }
    });
  }

}
