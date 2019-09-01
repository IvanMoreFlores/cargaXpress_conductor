import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { AlertController, Platform } from '@ionic/angular';
import { ToastController, IonRouterOutlet } from '@ionic/angular';
import { ServicioService } from '../../services/servicio/servicio.service';
import * as moment from 'moment';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { Subscription, from } from 'rxjs';
import { Events } from '@ionic/angular';
import { ViewChild, ElementRef } from '@angular/core';
import { SocketService } from '../../services/socket/socket.service';

@Component({
  selector: 'app-cond-home',
  templateUrl: './cond-home.page.html',
  styleUrls: ['./cond-home.page.scss'],
})
export class CondHomePage implements OnInit {

  sin_datos: Boolean = true;
  con_datos: Boolean = false;
  cero_datos: Boolean = false;
  trackings: any;
  page: number;
  contador: number;
  @ViewChild(IonRouterOutlet, { static: false }) routerOutlet: IonRouterOutlet;
  customBackActionSubscription: Subscription;
  constructor(private router: Router,
    private menu: MenuController,
    private crudService: FirebaseService,
    public alertController: AlertController,
    public servicio: ServicioService,
    public toastController: ToastController,
    public platform: Platform,
    public events: Events,
    public navCtrl: NavController,
    public socket: SocketService) { }

  ngOnInit() {
    // this.socket.IniciarTokenSinLogin();
    // this.menu.enable(true, 'custom');
    // this.menu.open('custom');
    this.menu.swipeGesture(false, 'custom');
    this.crudService.getTrackings().subscribe((data => {
      console.log(data);
    }));
    this.createUser();
    this.listarServicios();
  }

  openFirst() {
    this.menu.open('custom');
    this.menu.isOpen().then((data) => {
      console.log(data);
    });
  }

  detalle_servicio(id) {
    // alert('ionViewWillLeave: cond-tabs/Home ');
    // this.platform.backButton.unsubscribe();
    this.router.navigate(['/cond-servi-detalle', id]);
  }

  createUser() {
    this.socket.chatSocket();
    console.log('User created! ' + localStorage.getItem('name'));
    this.events.publish('user:created', localStorage.getItem('name'), Date.now());
  }

  listarServicios() {
    this.servicio.listar_trackings().subscribe((data => {
      console.log(data.trackings.length);
      console.log(data.trackings);
      if (data.trackings.length > 0) {
        this.page = data.page;
        this.trackings = data.trackings;
        this.con_datos = !this.con_datos;
        this.sin_datos = !this.sin_datos;
      } else {
        this.cero_datos = !this.cero_datos;
        this.sin_datos = !this.sin_datos;
      }
    }), error => {
      this.respuestaFail(error.error);
    });
  }

  devolver_fecha(fecha: any) {
    return (moment(fecha).format('DD-MM-YYYY'));
  }


  async respuestaFail(error: any) {
    console.log(error);
    if (error.msg) {
      const alert = await this.alertController.create({
        header: 'Error',
        backdropDismiss: false,
        message: error.msg,
        buttons: ['OK']
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: 'Error',
        message: 'Falla al intentar comunicarse con el servidor',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  doRefresh(event: any) {
    this.sin_datos = !this.sin_datos;
    this.con_datos = !this.con_datos;
    setTimeout(() => {
      this.listarServicios();
      event.target.complete();
    }, 2000);
  }

  siguiente(event) {
    this.servicio.listar_trackings_page(this.page + 1).subscribe((data => {
      if (data.trackings.length > 0) {
        this.page = data.page;
        this.trackings = this.trackings.concat(data.services);
        console.log(data.orders);
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

  ionViewDidEnter() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      } else if (this.router.url === '/cond-tabs/Home') {
        // this.cerrar();
        // or if that doesn't work, try
        // tslint:disable-next-line: no-string-literal
        // navigator['app'].exitApp();
        this.menu.isOpen().then((data) => {
          console.log(data);
          if (data === true) {
            this.menu.close('custom');
          } else {
            navigator['app'].exitApp();
          }
        });
      } else {
        this.navCtrl.pop();
        // this.generic.showAlert("Exit", "Do you want to exit the app?", this.onYesHandler, this.onNoHandler, "backPress");
      }
    });
  }

  // // tslint:disable-next-line: use-lifecycle-interface
  // ionViewWillLeave() {
  //   // alert('ionViewWillLeave: cond-tabs/Home ');
  //   this.platform.backButton.unsubscribe();
  // }

}
