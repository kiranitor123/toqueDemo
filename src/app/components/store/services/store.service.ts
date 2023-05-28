import { of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Business } from 'src/app/model/business.interface';
import { Owner } from 'src/app/model/owner';
import { environment } from 'src/environments/environment';
import { ImageUpload } from 'src/app/model/image';



@Injectable({
  providedIn: 'root'
})
export class StoreService {

  url:string = environment.server;

  business:string = "business";

  image:string ="file/images";
  
  headers:any;
  headersImage:any;

  token!:string;
  modal: boolean = false;
  modalProduct: boolean = false;

  constructor(
    private http: HttpClient) {
      this.headers = {
        'Content-Type': 'application/json',
      };
     }

     
  getAll() {
    return this.http
      .get<any[]>(this.url + this.business, { headers: this.headers })
      .toPromise();
  }

  getByID(id: string) {
    return this.http
      .get<any>(this.url + this.business + '/' + id, { headers: this.headers })
      .toPromise();
  }

  uploadImage(file: any) {
    return this.http
      .post<ImageUpload>(this.url + this.image, file, {
        headers: this.headersImage,
      })
      .toPromise();
  }

  update(item: any, id: string) {
    return this.http
      .patch<any>(this.url + this.business + '/' + id, item, {
        headers: this.headers,
      })
      .toPromise();
  }

  create(item: any) {
    return this.http
      .post<any>(this.url + this.business, item, { headers: this.headers })
      .toPromise();
  }

  delete(id: string) {
    return this.http
      .delete<any>(this.url + this.business + '/' + id, {
        headers: this.headers,
      })
      .toPromise();
  }

  updateSupplier(item:any, id:string){
    return this.http
    .put<any>(this.url + this.business + '/' + id, item, {
      headers: this.headers,
    })
    .toPromise();
  }

  getModal() {
    return this.modal;
  }

  openModal() {
    this.modal = true;
  }

  closeModal() {
    this.modal = false;
  }

  getModalProducts() {
    return this.modalProduct;
  }

  openModalProducts() {
    this.modalProduct = true;
  }

  closeModalProducts() {
    this.modalProduct = false;
  }
}
