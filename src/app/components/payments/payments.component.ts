import { zip } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { DeliveryService } from '../dashboard/services/delivery.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  selectedDate:any;

  newStructure:any[] =[];

  displayedColumns: string[] = [
    'position',
    'businessName',
    'user',
    'kind',
    'amount',
    'status',
    'actions',
  ];

  loading:boolean = false;
  noDataSourceMsg:boolean = false;

  constructor( private deliveryService: DeliveryService ) {

   }
   async payout(data:any){
    let value = await this.deliveryService.updatePaymentData(data.id)
    this.getDataValues();
   }


  async getDataValues(){
    let data = await this.deliveryService.getAllPayments();

    console.log(data);

    //First Structure
    this.newStructure = [];

    data.forEach(element => {
      let delivery = element.debts[0];
      let business = delivery.business;
      let user = delivery.createdUser;

      let amount = 0;
      element.debts.forEach((debt:any) => {
        debt.products.forEach((product:any) => {
          amount += product.price * product.quantity;
        })
      });

      let date = new Date(element.datePayment);
      date.setHours(0,0,0,0);

      let newData = {
          id: element.id,
          payout: element.payOut,
          payverify: element.payVerify,
          datePayment: element.datePayment,
          business,
          user,
          amount,
      }

      let find = this.newStructure.find((x:any) => x.dateData.getTime() == date.getTime());

      if(!find){
        let dataR = {
          dateData: date,
          data: [newData]
        }
        this.newStructure.push(dataR);
      }else{
        find.data.push(newData);
      }

      

    })
    console.log(this.newStructure);
    
  }

  async SeconStructure(){
    let data = await this.deliveryService.getAllPayments();
    
    //Second Structure

    let suppliers: PaymentData[] = [];
    data.forEach(element => {
      

      element.debts.forEach((debt:any) => {
        let find = suppliers.find((x:any) => x.supplier.id == debt.supplier.id);

        let amount = 0;
        debt.products.forEach((product:any) => {
          amount += product.price * product.quantity;
        });
        let data: PaymentData = {
          supplier: debt.supplier,
          acept: null,
          untilacept: null,
        };

        if(element.payVerify){
          data.acept = {
            amount,
            cantidad: debt.products.length,
          }
        }else{
          data.untilacept = {
            amount,
            cantidad: debt.products.length,
          }
        }
        

        if(!find){  
          suppliers.push(data);
        }else {
          if(element.payVerify){
            find.acept.amount += amount;
            find.acept.cantidad += debt.products.length;
          }else{
            find.untilacept.amount += amount;
            find.untilacept.cantidad += debt.products.length;
          }
        }
      })
    })


    console.log(suppliers);
  }

  async ngOnInit() {
    this.getDataValues();
  }
  
  async createPaymentData(){
    let del = await this.deliveryService.getAll(this.selectedDate.toDateString()!);

    let usersId:any = [];

    del.forEach(element => {
      let find = usersId.find((x:any) => x.id == element.createdUser.id);

      if(!find){
        let data = {
          id: element.createdUser.id,
          data: [element.id]
        }
        usersId.push(data);
      }else {
        find.data.push(element.id);
      }
    })
    if(usersId.length > 0){
      let payments = usersId.map((payment:any) => {
        let info = {
          userID: payment.id,
          deliveriesIDs: payment.data
        }
        return this.deliveryService.createPaymentData(info);
      });
  
      zip(...payments).subscribe(payment => {
        console.log(payment);
        this.getDataValues();
      })
    }else{
      console.log('no data');
      alert('No hay datos para crear');
    }

  }

  async update(type: string, event: MatDatepickerInputEvent<Date>) {
    this.selectedDate = event.value; 
  }

}

export interface PaymentData {
  supplier: any,
  acept: any,
  untilacept: any,
}
