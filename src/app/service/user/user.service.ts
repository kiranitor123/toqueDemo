import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserSupplier } from 'src/app/model/user.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  url:string = environment.server;

  owner:string ="user/owner";

  supplier:string ="user/supplier";

  listAll:string = "user";
  notification: string= "notification";

  listAllManagersURL:string = "user/manager/business/";

  headers:any;

  constructor(private http: HttpClient) { 
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  async listaAllUsers(){
    let paramsOwner = new HttpParams();
    paramsOwner = paramsOwner.append('kind', 'OWNER');
    let paramsSupplier = new HttpParams();
    paramsSupplier = paramsSupplier.append('kind', 'SUPPLIER');

    let owners =  await this.http
    .get<any[]>(this.url + this.listAll , { headers: this.headers ,params: paramsOwner})
    .toPromise();

    let suppliers = await this.http
    .get<any[]>(this.url + this.listAll , { headers: this.headers ,params: paramsSupplier})
    .toPromise();

    return {owners,suppliers};
  }

  listAllManagers(idBusines:number){
    return this.http
    .get<any[]>(this.url+this.listAllManagersURL+idBusines, {headers: this.headers}).toPromise();
  }

  sendNotification(data:any){
    return this.http
    .post<any>(this.url+this.notification, data,  {headers: this.headers}).toPromise();
  }

  createUser(user:User){

    return this.http
        .post<any>(this.url+this.owner, user,  {headers: this.headers})
  }

  createUserSupplier(user:UserSupplier){

    return this.http
        .post<any>(this.url+this.supplier, user,  {headers: this.headers}).toPromise();
  }

  createUserOwner(user:any){

    return this.http
        .post<any>(this.url+this.owner, user,  {headers: this.headers}).toPromise();
  }

}
