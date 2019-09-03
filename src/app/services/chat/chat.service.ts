import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  datos: any;
  ip = 'https://cargaxpress-api-dev.mybluemix.net/api/v1/';
  // tslint:disable-next-line: variable-name
  api_get_chat: string = this.ip + 'trackings/';
  // tslint:disable-next-line: variable-name
  api_post_chat: string = this.ip + 'trackings/';
  constructor(public http: HttpClient) {

  }

  get_chat(idTranckig: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(this.api_get_chat + idTranckig + '/chats?limit=1000&page=1', httpOptions)
      .pipe(map(
        results => results
      ));
  }
}
