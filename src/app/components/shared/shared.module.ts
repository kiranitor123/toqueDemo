import { AppMaterialModule } from './../../app-material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryComponent } from './history/history.component';
import { NgxVerticalTimelineModule } from 'ngx-vertical-timeline';
import { InfoBusinessComponent } from './info-business/info-business.component';


@NgModule({
  declarations: [HistoryComponent, InfoBusinessComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
    NgxVerticalTimelineModule,
    
  ],
 
  exports: [HistoryComponent,InfoBusinessComponent],
})
export class SharedModule { }
