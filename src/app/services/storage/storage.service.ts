import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage,
    private platform: Platform) { }

  guardar_session(datos: any) {
    this.platform.ready().then(() => {
      localStorage.setItem('id', datos.user._id);
      localStorage.setItem('token', datos.token);
      localStorage.setItem('profile', datos.user.profile.name);
      localStorage.setItem('name', datos.user.name);
      localStorage.setItem('lastName', datos.user.lastName);
      localStorage.setItem('email', datos.user.email);
    });
  }
}
