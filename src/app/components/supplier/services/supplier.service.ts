import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageUpload } from 'src/app/model/image';
import { Owner } from 'src/app/model/owner';
import { Product } from 'src/app/model/product.interface';
import { Supplier } from 'src/app/model/supplier.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private modal = false;

  url:string = environment.server;

  supplier:string = "supplier";

  product:string = "product";

  image:string ="file/images";
  
  headers:any;

  constructor(private http: HttpClient) { 
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  getAll() {
    return this.http
      .get<any[]>(this.url + this.supplier, { headers: this.headers })
      .toPromise();
  }

  getByID(id: string) {
    return this.http
      .get<any>(this.url + this.supplier + '/' + id, { headers: this.headers })
      .toPromise();
  }

  uploadImage(file: any) {
    return this.http
      .post<ImageUpload>(this.url + this.image, file)
      .toPromise();
  }

  update(item: any, id: string) {
    return this.http
      .patch<any>(this.url + this.supplier + '/' + id, item, {
        headers: this.headers,
      })
      .toPromise();
  }

  create(item: any) {
    return this.http
      .post<any>(this.url + this.supplier, item, { headers: this.headers })
      .toPromise();
  }

  delete(id: string) {
    return this.http
      .delete<any>(this.url + this.supplier + '/' + id, {
        headers: this.headers,
      })
      .toPromise();
  }

  createProduct(item: Product) {
    return this.http
    .post<any>(this.url + this.product, item, { headers: this.headers }).toPromise();
  }


  openModal() {
    this.modal = true;
  }

  closeModal() {
    this.modal = false;
  }

  getModal() {
    return this.modal;
  }
}
