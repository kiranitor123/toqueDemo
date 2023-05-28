import { InfoSupplierComponent } from './../dashboard/info-supplier/info-supplier.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { DeliveryService } from '../dashboard/services/delivery.service';
import { zip } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-info-payments',
  templateUrl: './info-payments.component.html',
  styleUrls: ['./info-payments.component.scss']
})
export class InfoPaymentsComponent implements OnInit {
  //https://morioh.com/p/b0903c6b3aef
  startDate?: Date;
  endDate?: Date;

  suppliersData: any[] = [];

  displayedColumns: string[] = [
    'position',
    'supplier',
    'amount',
    'payments',
    'untilpayment',
    'total',
    'actions'
  ]

  chartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
         scaleLabel: {
            display: true,
            labelString: 'Monto de los pedidos Expresado en Bs.'
         },
         ticks: {
            beginAtZero: true
         }
      }]
  },
    plugins: {
        datalabels: {
            anchor: "end",
            align: "end",
        },
    },
  };
  chartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  chartLegend = true;
  chartPlugins:any[] = [];

  chartData = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Pagado' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Pendiente' }
  ];


  loadingMsg:boolean = false;
  noDataSourceMsg:boolean = false;

  constructor( private deliveryService: DeliveryService,public modal: MatDialog) {

  }

  async SeconStructure(){
    let data = await this.deliveryService.getAllPaymentsFT(this.startDate?.toISOString(), this.endDate?.toISOString());

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
            if(find.acept){
              find.acept.amount += amount;
              find.acept.cantidad += debt.products.length;
            }else{
              find.acept = {
                amount,
                cantidad: debt.products.length,
              }
            }
          }else{
            if(find.untilacept){
              find.untilacept.amount += amount;
              find.untilacept.cantidad += debt.products.length;
            }else{
              find.untilacept = {
                amount,
                cantidad: debt.products.length,
              }
            }
          }
        }
      })
    })

    this.suppliersData = suppliers;
    this.suppliersData.map(data=> {
      if(!data.acept){
        data.acept = {
          amount: 0,
          cantidad: 0,
        }
      }
      if(!data.untilacept){
        data.untilacept = {
          amount: 0,
          cantidad: 0,
        }
      }
      return data;
    })
    console.log(this.suppliersData);
    this.chartLabels = [];
    this.chartData[0].data = [];
    this.chartData[1].data = [];
    this.suppliersData.forEach(element => {
      this.chartLabels.push(element.supplier.name);
      this.chartData[0].data.push(element.acept.amount);
      this.chartData[1].data.push(element.untilacept.amount);
    })

    console.log(this.chartData);
    this.chartData = [...this.chartData]
  }

  async ngOnInit() {

  }
  start(type: string, event: MatDatepickerInputEvent<Date>) {  
      this.startDate  = event.value!;
  }

  update(type: string, event: MatDatepickerInputEvent<Date>) {
      this.endDate  = event.value!;
      if(this.endDate){
        this.SeconStructure();
      }
      
  }

  info(data:any){
    if(data.supplier){
      const modalRef = this.modal.open(InfoSupplierComponent, {
        width: '80%',
        data: data.supplier,
      });
    }else{
      alert('No hay información de pago disponible');
    }

  }

}

export interface PaymentData {
  supplier: any,
  acept: any,
  untilacept: any,
}
