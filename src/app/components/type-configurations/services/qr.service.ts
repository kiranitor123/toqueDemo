import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImageUpload } from 'src/app/model/image';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QrService {

  url:string = environment.server;

  qr:string ="qrdata";

  image:string ="file/images";
  
  headers:any;

  constructor(private http: HttpClient) { 
    this.headers = {
      'Content-Type': 'application/json',
    };
  }
  getQR() {
    return this.http
      .get<any>(this.url + this.qr, { headers: this.headers })
      .toPromise();
  }

  uploadImage(file: any) {
    return this.http
      .post<ImageUpload>(this.url + this.image, file)
      .toPromise();
  }

  update(qr: any, id:string) {
    return this.http
      .patch<any>(this.url + this.qr+ '/' + id, qr, {
        headers: this.headers,
      })
      .toPromise();
  }
}
