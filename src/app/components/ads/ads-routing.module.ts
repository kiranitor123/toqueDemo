import { NgModule } from '@angular/core';


import { RouterModule, Routes } from '@angular/router';
import { ViewAdsComponent } from './view-ads/view-ads.component';

const routes: Routes = [{
      path: '',
      component: ViewAdsComponent,
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdsRoutingModule { }