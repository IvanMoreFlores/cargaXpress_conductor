import { Component, OnInit } from '@angular/core';
import { ServicioService } from '../../services/servicio/servicio.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { DrawerState } from '../../modules/ion-bottom-drawer/drawer-state';
import { ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { FirebaseService } from '../../services/firebase/firebase.service';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  MarkerOptions
} from '@ionic-native/google-maps';
import { Storage } from '@ionic/storage';

declare var google: any;

@Component({
  selector: 'app-cond-servi-seguimi',
  templateUrl: './cond-servi-seguimi.page.html',
  styleUrls: ['./cond-servi-seguimi.page.scss'],
})
export class CondServiSeguimiPage implements OnInit {
  map: GoogleMap;
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
  // map: any;
  trackings: any = [];
  distance: String;
  duration: String;
  botton: String = 'arrow-dropup';
  // tslint:disable-next-line: new-parens
  directionsService = new google.maps.DirectionsService;
  // tslint:disable-next-line: new-parens
  directionsDisplay = new google.maps.DirectionsRenderer;
  conductor: any;
  latitude: any;
  longitude: any;
  markers: any[] = [];
  estado: number = 1;
  tracking: any;
  coordenadas: any;
  constructor(private router: Router,
    public service: ServicioService,
    private activatedRoute: ActivatedRoute,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private geolocation: Geolocation,
    private launchNavigator: LaunchNavigator,
    public platform: Platform,
    private firebase: FirebaseService,
    private storage: Storage
    // private nativeGeocoder: NativeGeocoder
  ) {
    console.log(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  async ngOnInit() {
    await this.platform.ready();
    await this.loadMap();
    await this.listar_servicio();
  }

  async listar_servicio() {
    const loading = await this.loadingController.create({
      message: 'Espere por favor...'
    });
    await loading.present();
    this.service.listar_tracking_id(this.activatedRoute.snapshot.paramMap.get('id')).subscribe((async data => {
      console.log(data);
      this.servicio = data;
      loading.dismiss();
      await this.trazar_ruta();
    }), error => {
      loading.dismiss();
      this.respuestaFail(error.error);
    });
  }

  segmentChanged(ev: any) {
    this.category = ev.detail.value;
  }

  btton_maps() {
    // lat: this.coordenadas.coords.latitude,
    // lng: this.coordenadas.coords.longitude,
    const options: LaunchNavigatorOptions = {
      start: '' + this.coordenadas.coords.latitude + ', ' + this.coordenadas.coords.longitude + '',
      app: this.launchNavigator.APP.GOOGLE_MAPS
    }
    if (this.servicio.status === 1) {
      this.launchNavigator.navigate(this.servicio.service.order.initPlace, options)
        .then(
          success => console.log('Launched navigator'),
          error => console.log('Error launching navigator', error)
        );
    } else {
      this.launchNavigator.navigate(this.servicio.service.order.endPlace, options)
        .then(
          success => console.log('Launched navigator'),
          error => console.log('Error launching navigator', error)
        );
    }

  }

  btton_waze() {
    const options: LaunchNavigatorOptions = {
      start: '' + this.coordenadas.coords.latitude + ', ' + this.coordenadas.coords.longitude + '',
      app: this.launchNavigator.APP.WAZE
    }

    if (this.servicio.status === 1) {
      this.launchNavigator.navigate(this.servicio.service.order.initPlace, options)
        .then(
          success => console.log('Launched navigator'),
          error => console.log('Error launching navigator', error)
        );
    } else {
      this.launchNavigator.navigate(this.servicio.service.order.endPlace, options)
        .then(
          success => console.log('Launched navigator'),
          error => console.log('Error launching navigator', error)
        );
    }

  }

  async AlertEmergencia() {
    const alert = await this.alertController.create({
      header: 'Alerta',
      message: 'Desea pasar a estado de <strong>EMERGENCIA</strong>',
      backdropDismiss: false,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }

  async AlertEstado(mensaje) {
    const alert = await this.alertController.create({
      header: 'Alerta',
      message: 'Desea pasar a estado <strong>' + mensaje + '</strong>',
      backdropDismiss: false,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si',
          handler: () => {
            console.log('Confirm Okay');
            this.cambiar_estado();
          }
        }
      ]
    });
    await alert.present();
  }


  async cambiar_estado() {
    const loading = await this.loadingController.create({
      message: 'Espere por favor...'
    });
    await loading.present();
    if (this.servicio.status === 0) {
      this.service.change_status(this.servicio._id).subscribe((data => {
        console.log(data);
        console.log(data.tracking);
        this.servicio.status = data.tracking.status;
        loading.dismiss();
        this.respuestaOk(data.message);
        this.addFirebase();
      }), error => {
        loading.dismiss();
        this.respuestaFail(error.error);
      });
    } else {
      this.service.change_status(this.servicio._id).subscribe((data => {
        console.log(data);
        console.log(data.tracking);
        this.servicio.status = data.tracking.status;
        loading.dismiss();
        this.respuestaOk(data.message);
      }), error => {
        loading.dismiss();
        this.respuestaFail(error.error);
      });
    }
  }

  addFirebase() {
    this.tracking = {
      driver: localStorage.getItem('id'),
      location: {
        lat: this.coordenadas.coords.latitude,
        lng: this.coordenadas.coords.longitude,
      },
      status: this.servicio.status
    };
    this.firebase.addTracking(this.tracking).then((data) => {
      localStorage.setItem('id_tracking', data.id);
      // this.updateFirebase();
    });

  }

  updateFirebase() {
    if (localStorage.getItem('id_tracking')) {
      const watch = this.geolocation.watchPosition();
      watch.subscribe((data) => {
        this.tracking = {
          driver: localStorage.getItem('id'),
          location: {
            lat: data.coords.latitude,
            lng: data.coords.longitude,
          }
        };
        this.firebase.updateTracking(this.tracking, localStorage.getItem('id_tracking'));
      });
    } else {
      console.log('No existe id');
    }
  }

  loadMap() {
    this.map = GoogleMaps.create('map_canvas', {
      controls: {
        compass: false,
        myLocationButton: false,
        myLocation: true,
        indoorPicker: false,
        mapToolbar: false
      },
      gestures: {
        scroll: true,
        tilt: true,
        rotate: true,
        zoom: true
      },
      camera: {
        target: {
          lat: -11.95872679,
          lng: -77.0525224
        },
        zoom: 10
      },
      preferences: {
        zoom: {
          minZoom: 10,
          maxZoom: 15
        },
      }
    });
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      console.log('Map is ready!');
      this.geolocation.getCurrentPosition().then((resp) => {
        this.coordenadas = resp;
        this.map.animateCamera({
          target: {
            lat: resp.coords.latitude,
            lng: resp.coords.longitude
          },
          zoom: 15,
          duration: 1000,
        });
        this.updateFirebase();
      }).catch((error) => {
        console.log('Error getting location', error);
      });
    });
  }

  addMarker(opcion) {
    let icons;
    let pos;
    let titles;
    if (opcion === 1) {
      pos = {
        lat: this.servicio.service.order.endLocation.coordinates[1],
        lng: this.servicio.service.order.endLocation.coordinates[0],
      };
      icons = 'assets/img/llegada.png';
      titles = this.servicio.service.order.endPlace;
    } else {
      pos = {
        lat: this.servicio.service.order.initLocation.coordinates[1],
        lng: this.servicio.service.order.initLocation.coordinates[0],
      };
      icons = 'assets/img/partida.png';
      titles = this.servicio.service.order.initPlace;
    }
    const marker: MarkerOptions = {
      position: new LatLng(pos.lat, pos.lng), // marker position
      title: titles,
      icon: icons // custom image
    };
    // marker.clear();
    this.map.addMarker(marker);
  }

  async trazar_ruta() {
    const flightPlanCoordinates = [];
    const loading = await this.loadingController.create({
      message: 'Dibujando ruta...',
    });
    await loading.present();
    const star = this.servicio.service.order.initPlace;
    const end = this.servicio.service.order.endPlace;
    this.directionsService.route({
      origin: star,
      destination: end,
      travelMode: 'DRIVING'
    }, (response, status) => {
      // console.log(response);
      if (status === 'OK') {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < response.routes[0].overview_path.length; i += 1) {
          flightPlanCoordinates.push({
            lat: response.routes[0].overview_path[i].lat(), lng: response.routes[0].overview_path[i].lng()
          });
        }
        this.enrutar(flightPlanCoordinates);
        loading.dismiss();
        this.addMarker(0);
        this.addMarker(1);
        this.duration = response.routes[0].legs[0].duration.text;
        this.distance = response.routes[0].legs[0].distance.text;
        this.directionsDisplay.setDirections(response);
      } else {
        alert('Petición de indicaciones fallidas debido a ' + status);
      }
    });
  }

  enrutar(flightPlanCoordinates) {
    this.map.addPolyline({
      points: flightPlanCoordinates,
      color: '#000000',
      width: 3,
      geodesic: true
    });
  }

  changedState(ev) {
    // console.log(ev);
    if (ev === 0) {
      this.botton = 'arrow-dropup';
      return false;
      // tslint:disable-next-line: align
    } if (ev === 1) {
      this.botton = 'remove';
      return false;
      // tslint:disable-next-line: align
    } if (ev === 2) {
      this.botton = 'arrow-dropdown';
      return false;
    }
  }

  async respuestaFail(error: any) {
    // console.log(error);
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

  async respuestaOk(messages: any) {
    // console.log(error);
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Exito',
      message: messages,
      buttons: ['OK']
    });
    await alert.present();
  }

  agregar_chofer(chofer) {
    this.conductor = chofer;
    // console.log(chofer);
  }

  enableDashScroll() {
    // console.log('enableDashScroll');
    this.disableDrag = false;
  }

  disableDashScroll() {
    // console.log('disableDashScroll');
    this.disableDrag = true;
  }
}
