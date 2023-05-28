import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SugestService {

  url:string = environment.server;

  requests:string = "request";
  
  headers:any;
  
  constructor(
    private http: HttpClient) {
      this.headers = {
        'Content-Type': 'application/json'
      };
     }

     
  getAll() {
    return this.http
      .get<any[]>(this.url + this.requests, { headers: this.headers })
      .toPromise();
  }

  delete(id: string) {
    return this.http
      .delete<any>(this.url + this.requests + '/' + id, {
        headers: this.headers,
      })
      .toPromise();
  }
}
