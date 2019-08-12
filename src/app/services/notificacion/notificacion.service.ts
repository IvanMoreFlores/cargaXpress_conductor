import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  datos: any;
  ip = 'https://cargaxpress-api-dev.mybluemix.net/api/v1/';
  // tslint:disable-next-line: variable-name
  api_listar_notificaciones: string = this.ip + 'users/';

  constructor(public http: HttpClient) { }

  listar_notificaciones(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(this.api_listar_notificaciones + localStorage.getItem('id') + '/notifications', httpOptions)
      .pipe(map(
        results => results
      ));
  }

  listar_notificaciones_page(page: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(this.api_listar_notificaciones + localStorage.getItem('id') + '/notifications?sort=created&sortDir=dsc&page='
      + page, httpOptions)
      .pipe(map(
        results => results
      ));
  }
}
