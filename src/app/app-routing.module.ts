import { NgModule } from '@angular/core';
import { LoginComponent } from '../app/components/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/service/guard/auth.guard';
import { LoginGuard } from 'src/app/service/guard/login.guard';


const routes: Routes = [
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate:[LoginGuard],
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate:[AuthGuard],
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
