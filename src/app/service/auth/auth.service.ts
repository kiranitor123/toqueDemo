import { Router } from '@angular/router';
import { UserAdmin } from './../../model/useradmin.interface';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Admin } from 'src/app/model/admin';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url: string = environment.server;

  login: string = 'auth/loginAdmin';

  recovery: string = 'auth/recovery/admin'

  update: string = 'user/admin';

  logout: string = 'auth/logout';

  user: BehaviorSubject<any> = new BehaviorSubject(null);
  subscription: Subscription = new Subscription();

  headers:any;


  constructor(private http: HttpClient, private router: Router) {
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  getCurrentUser() {
    let user = JSON.parse(localStorage.getItem('user')!);
    return of(user);
  }

  resetPassword(email: string) {
    let user = { email };
    return this.http.post<any>(this.url + this.recovery, user, { headers: this.headers });

  }

  updateUser(admin: any, id:string) {
    return this.http
    .patch<any>(this.url + this.update + '/' + id, admin, {
      headers: this.headers,
    })
    .toPromise();
  }

  loginUser(email: string, password: string) {
    let user = { email, password };

    return this.http.post<any>(this.url + this.login, user, { headers: this.headers });
  }

  logoutUser() {
    const token = localStorage.getItem('token')!;
    let params = new HttpParams();
    params = params.append('token', token);
    return this.http
    .get<any>(this.url + this.logout, { headers: this.headers , params})
    .toPromise();
  }

}
