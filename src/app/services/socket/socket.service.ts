import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket, private toastCtrl: ToastController) { }

  IniciarTokenSinLogin() {
    this.socket.connect();
    const userId = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    console.log(userId);
    console.log(token);

    this.socket.emit('AUTHENTICATION', {
      userId,
      token
    }, (err) => {
      if (err) {
        // return Promise reject(err);
        console.log('error IniciarTokenSinLogin : ' + err);
      } else {
        console.log('Bien IniciarTokenSinLogin');
        // return Promise resolve();
      }
    });
  }


  conectarTrackigSocket(id) {
    this.socket.emit('CONNECT_TO_TRACKING', { trackingId: id }, (err) => {
      if (err) {
        // return Promise reject(err);
        console.log('error conectarTrackigSocket : ' + err);
      } else {
        console.log('Bien conectarTrackigSocket');
        // return Promise resolve();
      }
    });
  }


  chatSocket() {
    this.socket.on('NEW_MESSAGE', (data) => {
      if (data) {
        // return Promise reject(err);
        console.log('data chatSocket : ' + data);
        console.log(data);
      } else {
        console.log('Mal chatSocket');
        // return Promise resolve();
      }
    });
  }

  enviarChatSocket(id, message) {
    this.socket.emit('NEW_MESSAGE', { trackingId: id, data: { message } }, (err) => {
      if (err) {
        // return Promise reject(err);
        console.log('error enviarChatSocket : ' + err);
      } else {
        console.log('Bien enviarChatSocket');
        // return Promise resolve();
      }
    });
  }


}
