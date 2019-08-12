import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  datos: any;
  ip = 'https://cargaxpress-api-dev.mybluemix.net/api/v1/';
  // tslint:disable-next-line: variable-name
  api_login: string = this.ip + 'users/login';
  // tslint:disable-next-line: variable-name
  api_recover_pass: string = this.ip + 'users/resetPassword';

  constructor(public http: HttpClient) {
  }

  login(dato: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json'
      })
    };
    return this.http.post(this.api_login, dato, httpOptions)
      .pipe(map(
        results => results
      ));
  }

  recover_pass(dato: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json'
      })
    };
    return this.http.post(this.api_recover_pass, dato, httpOptions)
      .pipe(map(
        results => results
      ));
  }



}
