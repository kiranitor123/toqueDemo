import { HistoryComponent } from './../shared/history/history.component';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SupplierComponent } from './supplier/supplier.component';
import { AppMaterialModule } from 'src/app/app-material.module';
import { EditSupplierComponent } from './edit-supplier/edit-supplier.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { InfoBusinessComponent } from '../shared/info-business/info-business.component';


@NgModule({
  declarations: [
    SupplierComponent,
    EditSupplierComponent
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxMaterialTimepickerModule,
    SharedModule
  ],
  entryComponents: [HistoryComponent, InfoBusinessComponent]
})
export class SupplierModule { }
