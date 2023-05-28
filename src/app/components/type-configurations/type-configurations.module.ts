import { SharedModule } from './../shared/shared.module';
import { HistoryComponent } from './../shared/history/history.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'
import { AppMaterialModule } from 'src/app/app-material.module';

import { CategoryComponent } from './category/view-category/category.component';
import { EditCategoryComponent } from './category/edit-category/edit-category.component';
import { NotificationComponent } from './notification/notification.component';
import { QrComponent } from './qr/qr.component'



@NgModule({
  declarations: [
    CategoryComponent,
    EditCategoryComponent,
    NotificationComponent,
    QrComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    AppMaterialModule
  ],
  entryComponents: [HistoryComponent]
})
export class TypeConfigurationsModule { }
