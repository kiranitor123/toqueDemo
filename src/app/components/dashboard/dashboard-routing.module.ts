import { QrComponent } from './../type-configurations/qr/qr.component';
import { HomeComponent } from './../home/home.component';
import { NgModule } from '@angular/core';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { SupplierComponent } from '../supplier/supplier/supplier.component';
import { EditStoreComponent } from '../store/edit-store/edit-store.component';
import { EditSupplierComponent } from '../supplier/edit-supplier/edit-supplier.component'
import { CategoryComponent } from '../type-configurations/category/view-category/category.component';
import { EditCategoryComponent } from '../type-configurations/category/edit-category/edit-category.component';
import { NotificationComponent } from '../type-configurations/notification/notification.component';

import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/service/guard/auth.guard';
import { EditAdsComponent } from '../ads/edit-ads/edit-ads.component';
import { ViewAdsComponent } from '../ads/view-ads/view-ads.component';
import { PaymentsComponent } from '../payments/payments.component';
import { InfoPaymentsComponent } from '../info-payments/info-payments.component';

const routes: Routes = [{
  path: '',
  component: DashboardComponent,
  canActivate: [AuthGuard],
   children: [
     {
       path: '',
       redirectTo: 'home',
       pathMatch: 'full'
     },
     {
      path: 'home',
      component: HomeComponent,
    },
    {
      path: 'supplier',
      component: SupplierComponent,
    },
    {
      path: 'store',
      loadChildren: () => import('../store/store.module').then(m => m.StoreModule),
    },
    {
      path: 'supplier/add',
      component: EditSupplierComponent,
    },
    {
      path: 'supplier/edit/:id',
      component: EditSupplierComponent,
    },
    {
      path: 'ads',
      component: ViewAdsComponent,
    },
    {
      path: 'ads/add',
      component: EditAdsComponent,
    },
    {
      path: 'ads/edit/:id',
      component: EditAdsComponent,
    },
    {
      path: 'store/add',
      component: EditStoreComponent,
    },
    {
      path: 'store/edit/:id',
      component: EditStoreComponent,
    },
    {
      path: 'category',
      component: CategoryComponent,
    },
    {
      path: 'category/add',
      component: EditCategoryComponent,
    },
    {
      path: 'category/edit/:id',
      component: EditCategoryComponent,
    },
    {
      path: 'notification/add',
      component: NotificationComponent,
    },
    {
      path: 'qr',
      component: QrComponent,
    },
    {
      path: 'pagospendientes',
      component: PaymentsComponent,
    },
    {
      path: 'infopayments',
      component: InfoPaymentsComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
