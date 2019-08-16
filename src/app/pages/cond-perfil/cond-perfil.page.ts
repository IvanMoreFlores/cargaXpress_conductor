import { Component, OnInit } from '@angular/core';
import { MenuController, LoadingController, NavController } from '@ionic/angular';
import { AlertController, IonRouterOutlet, Platform } from '@ionic/angular';
// import { ProfileService } from '../../services/profile/profile.service';
import { PerfilService } from '../../services/perfil/perfil.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-cond-perfil',
  templateUrl: './cond-perfil.page.html',
  styleUrls: ['./cond-perfil.page.scss'],
})
export class CondPerfilPage implements OnInit {

  perfil: any = [];
  @ViewChild(IonRouterOutlet, { static: false }) routerOutlet: IonRouterOutlet;
  customBackActionSubscription: Subscription;
  constructor(private menu: MenuController,
    public _profile: PerfilService,
    public platform: Platform,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private router: Router,
    public navCtrl: NavController) { }

  ngOnInit() {
    this.menu.swipeGesture(false, 'custom');
    this.listarUser();
  }

  listarUser() {
    this._profile.listar_user().subscribe((data => {
      this.perfil = data;
      console.log(data);
    }), error => {
      this.respuestaFail(error.error);
    });
  }

  openFirst() {
    this.menu.open('custom');
  }

  doRefresh(event: any) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  }

  edit_perfil(id: any) {
    // this.platform.backButton.unsubscribe();
    console.log(id);
    this.router.navigate(['/edit-perfil', id]);
  }

  async respuestaFail(error: any) {
    console.log(error);
    if (error.msg) {
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: 'Error',
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

  ionViewDidEnter() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      } else if (this.router.url === '/cond-tabs/Perfil') {
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
        // alert("ionViewDidEnter");
      }
    });
  }


  // tslint:disable-next-line: use-lifecycle-interface
  // ionViewWillLeave() {
  //   // alert('ionViewWillLeave: cond-Perfil ');
  //   this.platform.backButton.unsubscribe();
  // }


}
