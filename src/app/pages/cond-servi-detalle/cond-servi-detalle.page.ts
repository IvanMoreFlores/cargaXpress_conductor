import { Component, OnInit } from '@angular/core';
import { ServicioService } from '../../services/servicio/servicio.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-cond-servi-detalle',
  templateUrl: './cond-servi-detalle.page.html',
  styleUrls: ['./cond-servi-detalle.page.scss'],
})
export class CondServiDetallePage implements OnInit {
  servicio: any = {};
  constructor(private router: Router,
    public service: ServicioService,
    private activatedRoute: ActivatedRoute,
    public loadingController: LoadingController,
    public alertController: AlertController) {
    console.log(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Espere por favor...'
    });
    await loading.present();
    this.service.listar_servicio_id(this.activatedRoute.snapshot.paramMap.get('id')).subscribe((data => {
      console.log(data);
      this.servicio = data;
      loading.dismiss();
    }), error => {
      loading.dismiss();
      this.respuestaFail(error.error);
    });
  }

  click_seguimiento(id: any) {
    this.router.navigate(['/servicio-seguimiento', id]);
    // this.router.navigate(['/pedido-detalle', id]);
  }

  devolver_fecha(fecha: any) {
    return (moment(fecha).format('DD-MM-YYYY'));
  }

  async respuestaFail(error: any) {
    console.log(error);
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

}
