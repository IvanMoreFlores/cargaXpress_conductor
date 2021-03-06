import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  datos: any;
  ip = 'https://cargaxpress-api-dev.mybluemix.net/api/v1/';
  // tslint:disable-next-line: variable-name
  api_listar_user: string = this.ip + 'users/';

  constructor(public http: HttpClient) {
  }

  listar_user(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json'
      })
    };
    return this.http.get(this.api_listar_user + localStorage.getItem('id'), httpOptions)
      .pipe(map(
        results => results
      ));
  }

}
