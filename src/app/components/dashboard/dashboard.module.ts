import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from './../../app-material.module';
import { HomeComponent } from './../home/home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SupplierModule } from '../supplier/supplier.module';
import { TypeConfigurationsModule } from '../type-configurations/type-configurations.module';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatTreeModule} from '@angular/material/tree';
import { AdsModule } from '../ads/ads.module';
import { SugestsComponent } from './sugests/sugests.component';
import { PaymentsComponent } from '../payments/payments.component';
import { InfoPaymentsComponent } from '../info-payments/info-payments.component';
import { ChartsModule } from '@rinminase/ng-charts';
import { InfoSupplierComponent } from './info-supplier/info-supplier.component';
@NgModule({
  declarations: [
    DashboardComponent,
    SugestsComponent,
    HomeComponent,
    PaymentsComponent,
    InfoPaymentsComponent,
    InfoSupplierComponent
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    DashboardRoutingModule,
    SupplierModule,
    AdsModule,
    MatTreeModule,
    RouterModule,
    TypeConfigurationsModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule
  ],
  entryComponents: [SugestsComponent,InfoSupplierComponent]
})
export class DashboardModule { }
