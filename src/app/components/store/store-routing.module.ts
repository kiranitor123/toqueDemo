import { NgModule } from '@angular/core';
import { ViewStoreComponent } from './view-store/view-store.component'

import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
      path: '',
      component: ViewStoreComponent,
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }