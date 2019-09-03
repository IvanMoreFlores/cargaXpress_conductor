import { Component, OnInit, ViewChild } from '@angular/core';
import { SocketService } from '../../services/socket/socket.service';
import { Socket } from 'ngx-socket-io';
import { ChatService } from '../../services/chat/chat.service';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { IonContent } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-cond-chat',
  templateUrl: './cond-chat.page.html',
  styleUrls: ['./cond-chat.page.scss'],
})
export class CondChatPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent;

  //
  mensaje: String = '';
  list_chat: any;
  list_mensaje: any;
  mensaje_totales: any;
  id_owner;
  fatBootonDropup = false;
  fatBootonDropdown = true;

  constructor(private activatedRoute: ActivatedRoute,
    private socket: Socket,
    public socketS: SocketService,
    public chat: ChatService,
    public modalController: ModalController,
    public navController: NavController) {
    this.id_owner = localStorage.getItem('id');
  }

  async ngOnInit() {
    await this.socketS.IniciarTokenSinLogin();
    await this.socketS.conectarTrackigSocket(this.activatedRoute.snapshot.paramMap.get('id'));
    await this.chatSocket();
    await this.listarChat();
  }

  chatSocket() {
    this.socket.on('NEW_MESSAGE', (data) => {
      if (data) {
        console.log('data chatSocket : ' + data);
        this.list_mensaje.push(data.message);
      } else {
        console.log('Mal chatSocket');
      }
    });
  }

  listarChat() {
    this.chat.get_chat(this.activatedRoute.snapshot.paramMap.get('id')).subscribe((data => {
      this.list_mensaje = data.messages.sort();
    }));
  }

  devolver_fecha(fecha: any) {
    return (moment(fecha).format('DD-MM-YYYY, h:mm:ss a'));
  }

  devolver_letra(nombre: any) {
    return (nombre.charAt(0));
  }

  enviarMensaje() {
    this.enviarChatSocket(this.activatedRoute.snapshot.paramMap.get('id'), this.mensaje);
  }

  enviarChatSocket(id, message) {
    this.socket.emit('NEW_MESSAGE', { trackingId: id, data: { message } }, (err, data) => {
      if (err) {
        console.log('error enviarChatSocket : ' + err);
      } else {
        this.mensaje = '';
        console.log('Bien enviarChatSocket');
        this.list_mensaje.push(data.message);
      }
    });
  }

  onScroll(event) {
    console.log(event.detail.deltaY);
    // used a couple of "guards" to prevent unnecessary assignments if scrolling in a direction and the var is set already:
    if (event.detail.deltaY > 0) {
      console.log('scrolling down, hiding footer...');
      this.fatBootonDropup = false;
      this.fatBootonDropdown = true;
    } else {
      console.log('scrolling up, revealing footer...');
      this.fatBootonDropup = true;
      this.fatBootonDropdown = false;
    }
  }

  ScrollToBottom() {
    this.content.scrollToBottom(1500);
  }

  ScrollToTop() {
    this.content.scrollToTop(1500);
  }

  ionViewWillLeave() {
    this.socket.disconnect();
  }

  cerrar() {
    this.navController.pop();
  }

}
