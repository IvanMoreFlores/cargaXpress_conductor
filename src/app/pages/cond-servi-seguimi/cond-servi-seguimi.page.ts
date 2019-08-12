import { Component, OnInit } from '@angular/core';
import { ServicioService } from '../../services/servicio/servicio.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { DrawerState } from '../../modules/ion-bottom-drawer/drawer-state';
import { ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
// import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import * as moment from 'moment';
declare var google: any;

@Component({
  selector: 'app-cond-servi-seguimi',
  templateUrl: './cond-servi-seguimi.page.html',
  styleUrls: ['./cond-servi-seguimi.page.scss'],
})
export class CondServiSeguimiPage implements OnInit {

  @ViewChild('map', { static: false }) mapElement: ElementRef;
  public category: String = 'Informacion';
  public categories: Array<string> = ['Informacion', 'SubServicios', 'Chofer', 'Chat'];
  shouldBounce = true;
  disableDrag = true;
  dockedHeight = 300;
  distanceTop = 56;
  drawerState = DrawerState.Bottom;
  states = DrawerState;
  minimumHeight = 52;
  servicio: any = {};
  map: any;
  trackings: any = [];
  botton: String = 'arrow-dropup';
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  conductor: any;
  constructor(private router: Router,
    public service: ServicioService,
    private activatedRoute: ActivatedRoute,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private geolocation: Geolocation,
    // private nativeGeocoder: NativeGeocoder
    ) {
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
      this.loadMap();
    }), error => {
      loading.dismiss();
      this.respuestaFail(error.json());
    });
  }

  segmentChanged(ev: any) {
    this.category = ev.detail.value;
  }

  click_subSevicios() {
    // this.service.listar_trackings(this.servicio.order._id).subscribe((data => {
    //   this.trackings = data.trackings;
    //   console.log(data.trackings);
    // }), error => {
    //   this.respuestaFail(error.json());
    // });
  }

  async loadMap() {
    const loading = await this.loadingController.create({
      message: 'Dibujando mapa...',
    });
    await loading.present();
    this.geolocation.getCurrentPosition().then((resp) => {
      const latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      const mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeControl: false,
        zoomControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.map.addListener('tilesloaded', () => {
        loading.dismiss();
        this.trazar_ruta();
        this.click_subSevicios();
      });
      this.directionsDisplay.setMap(this.map);
    }).catch((error) => {
      loading.dismiss();
      console.log('Error getting location', error);
    });
  }

  async trazar_ruta() {
    const loading = await this.loadingController.create({
      message: 'Dibujando ruta...',
    });
    await loading.present();
    const star = this.servicio.order.initPlace;
    const end = this.servicio.order.endPlace;
    this.directionsService.route({
      origin: star,
      destination: end,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);
        loading.dismiss();
      } else {
        loading.dismiss();
        alert('Petición de indicaciones fallidas debido a ' + status);
      }
    });
  }

  changedState(ev) {
    console.log(ev);
    if (ev === 0) {
      this.botton = 'arrow-dropup';
      return false;
    } if (ev === 1) {
      this.botton = 'remove';
      return false;
    } if (ev === 2) {
      this.botton = 'arrow-dropdown';
      return false;
    }
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

  agregar_chofer(chofer) {
    this.conductor = chofer;
    console.log(chofer);
  }

  enableDashScroll() {
    console.log('enableDashScroll');
    this.disableDrag = false;
  }

  disableDashScroll() {
    console.log('disableDashScroll');
    this.disableDrag = true;
  }

}
