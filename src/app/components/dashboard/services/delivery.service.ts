import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  url:string = environment.server;

  delivery:string = "delivery/all";

  paymentData:string = "payment-data";
  
  paymentDataAll:string = "payment-data/all";

  verifyPayment:string = "payment-data/admin";

  headers:any;
  
  constructor(
    private http: HttpClient) {
      this.headers = {
        'Content-Type': 'application/json'
      };
     }

     
  getAll(fromdate:string) {
    let from = {
      from: fromdate
    }

    return this.http
    .post<any[]>(this.url + this.delivery, from, { headers: this.headers })
    .toPromise();
  }

  createPaymentData(deliveriesIDs:any) {
    console.log(deliveriesIDs);
    return this.http
    .post<any>(this.url + this.paymentData, deliveriesIDs, { headers: this.headers })
  }

  getAllPaymentsFT(from:any, to:any){
    let data = {
      from,to
    }
    return this.http
    .post<any[]>(this.url + this.paymentDataAll, data, { headers: this.headers })
    .toPromise();
  }

  getAllPayments(){
    return this.http
    .get<any[]>(this.url + this.paymentDataAll, { headers: this.headers })
    .toPromise();
  }

  updatePaymentData(id:string){
    return this.http
    .patch<any>(this.url + this.verifyPayment +'/'+id, { headers: this.headers })
    .toPromise();
  }
  
}
