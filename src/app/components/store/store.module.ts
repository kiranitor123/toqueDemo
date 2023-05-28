import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewStoreComponent } from './view-store/view-store.component';
import { StoreRoutingModule } from './store-routing.module';
import { AppMaterialModule } from '../../app-material.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditStoreComponent } from './edit-store/edit-store.component';
import { BranchsComponent } from './branchs/branchs.component';
import { HistoryComponent } from '../shared/history/history.component';
import { InfoBusinessComponent } from '../shared/info-business/info-business.component';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    ViewStoreComponent,
    EditStoreComponent,
    BranchsComponent
  ],
  imports: [
    CommonModule,
    StoreRoutingModule,
    AppMaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAO_EiV2kAIgVpZYAluOfeiMbH5gidv2DA'
    })
  ],
  exports: [
    StoreRoutingModule
  ],
  schemas:[ NO_ERRORS_SCHEMA],
  entryComponents: [HistoryComponent, InfoBusinessComponent]
})
export class StoreModule { }
