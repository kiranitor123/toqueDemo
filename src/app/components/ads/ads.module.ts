import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../../app-material.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditAdsComponent } from './edit-ads/edit-ads.component';
import { ViewAdsComponent } from './view-ads/view-ads.component';
import { AdsRoutingModule } from './ads-routing.module';
import { HistoryComponent } from '../shared/history/history.component';


@NgModule({
  declarations: [
    EditAdsComponent,
    ViewAdsComponent
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AdsRoutingModule
  ],
  entryComponents: [HistoryComponent]
  
})
export class AdsModule { }
