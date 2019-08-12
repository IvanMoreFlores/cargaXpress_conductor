import { Component, OnInit } from '@angular/core';
import { ServicioService } from '../../services/servicio/servicio.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { DrawerState } from '../../modules/ion-bottom-drawer/drawer-state';
import { ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
// import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import * as moment from 'moment';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';

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
  constructor(private router: Router,
    public service: ServicioService,
    private activatedRoute: ActivatedRoute,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private geolocation: Geolocation,
    private launchNavigator: LaunchNavigator,
    public platform: Platform
    // private nativeGeocoder: NativeGeocoder
  ) {
    this.loadMap();
    console.log(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  async ngOnInit() {
    this.platform.ready().then(() => this.loadMap());
  }

  async listar_servicio() {
    const loading = await this.loadingController.create({
      message: 'Espere por favor...'
    });
    await loading.present();
    this.service.listar_servicio_id(this.activatedRoute.snapshot.paramMap.get('id')).subscribe((data => {
      console.log(data);
      this.servicio = data;
      loading.dismiss();
      this.trazar_ruta();
    }), error => {
      loading.dismiss();
      this.respuestaFail(error.error);
    });
  }

  segmentChanged(ev: any) {
    this.category = ev.detail.value;
  }

  btton_maps() {
    const options: LaunchNavigatorOptions = {
      start: '' + this.latitude + ', ' + this.longitude + '',
      app: this.launchNavigator.APP.GOOGLE_MAPS
    }

    this.launchNavigator.navigate(this.servicio.order.endPlace, options)
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
  }

  btton_waze() {
    const options: LaunchNavigatorOptions = {
      start: '' + this.latitude + ', ' + this.longitude + '',
      app: this.launchNavigator.APP.WAZE
    }

    this.launchNavigator.navigate(this.servicio.order.endPlace, options)
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
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

  async AlertEstado() {
    const alert = await this.alertController.create({
      header: 'Alerta',
      message: 'Desea pasar a estado <strong>EN CAMINO</strong>',
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

  loadMap() {

    


    // this.geolocation.getCurrentPosition().then((resp) => {
    //   this.latitude = resp.coords.latitude;
    //   this.longitude = resp.coords.longitude;
    //   console.log('' + resp.coords.latitude + ', ' + resp.coords.longitude + '');
    //   console.log(resp.coords.latitude);
    //   console.log(resp.coords.longitude);
    //   const latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
    //   const mapOptions = {
    //     center: latLng,
    //     zoom: 15,
    //     mapTypeControl: false,
    //     zoomControl: false,
    //     streetViewControl: false,
    //     fullscreenControl: false,
    //     maxZoom: 15,
    //     mapTypeId: google.maps.MapTypeId.ROADMAP
    //   };
    //   this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    //   this.map.addListener('tilesloaded', () => {
    //   });
    //   this.directionsDisplay.setMap(this.map);
    //   this.directionsDisplay.setOptions({
    //     suppressMarkers: true, polylineOptions: {
    //       // strokeWeight: 4,
    //       // strokeOpacity: 4,
    //       strokeColor: 'black'
    //     }
    //   });
    // }).catch((error) => {
    //   console.log('Error getting location', error);
    // });
  }

  addMarker(opcion) {
    let icons;
    let pos;
    let title;
    if (opcion === 1) {
      pos = {
        lat: this.servicio.order.endLocation.coordinates[1],
        lng: this.servicio.order.endLocation.coordinates[0],
      };
      icons = 'assets/img/llegada.png';
      title = this.servicio.order.endPlace;
    } else {
      pos = {
        lat: this.servicio.order.initLocation.coordinates[1],
        lng: this.servicio.order.initLocation.coordinates[0],
      };
      icons = 'assets/img/partida.png';
      title = this.servicio.order.initPlace;
    }
    // console.log(this.map);

    // console.log(pos);
    const marker = new google.maps.Marker({
      position: pos, // marker position
      // map: this.map,
      title: 'Hello World!',
      icon: icons // custom image
    });
    // marker.clear();
    marker.setMap(this.map);
    // this.map.addMarker(marker);
  }

  addMarker_gps(coords) {
    const pos = {
      lat: coords.latitude,
      lng: coords.longitude,
    };

    // console.log(pos);
    const marker = new google.maps.Marker({
      position: pos, // marker position
      // map: this.map,
      title: 'Hello World!',
      icon: 'assets/img/driver.png' // custom image
    });
    marker.setMap(null);
    marker.setMap(this.map);
    // this.map.addMarker(marker);
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
      // console.log(response);
      if (status === 'OK') {
        const watch = this.geolocation.watchPosition();
        watch.subscribe((data) => {
          console.log('watchPosition');
          this.addMarker_gps(data.coords);
          console.log(data);
        });
        this.addMarker(0);
        this.addMarker(1);
        this.duration = response.routes[0].legs[0].duration.text;
        this.distance = response.routes[0].legs[0].distance.text;
        this.directionsDisplay.setDirections(response);
        loading.dismiss();
      } else {
        loading.dismiss();
        alert('Petición de indicaciones fallidas debido a ' + status);
      }
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
