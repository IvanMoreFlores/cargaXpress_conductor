import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  datos: any;
  ip = 'https://cargaxpress-api-dev.mybluemix.net/api/v1/';
  // tslint:disable-next-line: variable-name
  api_listar_servicios: string = this.ip + 'users/';
  // tslint:disable-next-line: variable-name
  api_servicios_id: string = this.ip + 'services/';

  constructor(public http: HttpClient) { }

  listar_servicios(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(this.api_listar_servicios + localStorage.getItem('id') + '/services', httpOptions)
      .pipe(map(
        results => results
      ));
  }

  listar_servicios_page(page: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(this.api_listar_servicios + localStorage.getItem('id') + '/services?sort=created&sortDir=dsc&page='
      + page, httpOptions)
      .pipe(map(
        results => results
      ));
  }

  listar_servicio_id(data): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(this.api_servicios_id + data , httpOptions)
      .pipe(map(
        results => results
      ));
  }
}
