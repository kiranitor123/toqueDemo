import { InfoUser } from './../../../model/info';
import { Injectable } from '@angular/core';
import { Admin } from 'src/app/model/admin';
import { Category } from 'src/app/model/category.interface';
import { FileUpload } from 'src/app/model/file-upload';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ImageUpload } from 'src/app/model/image';

@Injectable({
  providedIn: 'root'
})
export class TypeConfigService {

  url:string = environment.server;

  category:string ="category";

  image:string ="file/images";
  
  headers:any;

  constructor(private http: HttpClient) { 
    this.headers = {
      'Content-Type': 'application/json',
    };
  }
  getCategories() {
    return this.http
      .get<any[]>(this.url + this.category, { headers: this.headers })
      .toPromise();
  }

  getByID(id: string) {
    return this.http
      .get<any>(this.url + this.category + '/' + id, { headers: this.headers })
      .toPromise();
  }

  uploadCategoryImage(file: any) {
    return this.http
      .post<ImageUpload>(this.url + this.image, file)
      .toPromise();
  }

  update(category: any, id: string) {
    return this.http
      .patch<any>(this.url + this.category + '/' + id, category, {
        headers: this.headers,
      })
      .toPromise();
  }

  create(category: any) {
    return this.http
      .post<any>(this.url + this.category, category, { headers: this.headers })
      .toPromise();
  }

  delete(id: string) {
    return this.http
      .delete<any>(this.url + this.category + '/' + id, {
        headers: this.headers,
      })
      .toPromise();
  }

}
