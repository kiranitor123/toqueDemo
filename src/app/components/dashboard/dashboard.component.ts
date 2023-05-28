import { map } from 'rxjs/operators';
import { SugestsComponent } from './sugests/sugests.component';
import { interval, Observable, Subscription } from 'rxjs';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';
import {MediaMatcher} from '@angular/cdk/layout';
import { Router } from '@angular/router';

import { Menu } from './menu/menu';

import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { Admin } from 'src/app/model/admin';
import { MatDialog } from '@angular/material/dialog';
import { SugestService } from './services/sugest.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  fillerNav = Menu;

  treeControl = new NestedTreeControl<any>(node => node.children);
  dataSource = new MatTreeNestedDataSource<any>();
  user: Observable<Admin>;
  hover = true
  openRegister = false;
  sugest:any[] = [];
  sub: Subscription = new Subscription;
  private _mobileQueryListener: () => void;
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router:Router,public modal: MatDialog,
    private sugestService:SugestService,
              private authService: AuthService, private auth: AuthService) {
    this.dataSource.data = this.fillerNav;
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.user = this.auth.getCurrentUser();
  }
  hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;
  async ngOnInit() {
    this.sugest = await this.sugestService.getAll();
  this.sub =interval(60000).pipe(
     map(async tick => {
       this.sugest = await this.sugestService.getAll();
       return tick;
     })
   ).subscribe()
  }

  openNotifications(){
    const modalRef = this.modal.open(SugestsComponent, {
      width: '80%',
      data: this.sugest,
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.sub.unsubscribe();
  }

  shouldRun = true;

  async logout() {
    try {
      this.authService.logoutUser().then(() => {
        localStorage.clear();
        this.router.navigate(['/login']);
      })
    } catch (error) {
      console.error('dashboard error -> ', error)
    }
  }

  RegisterClick() {
    if (this.openRegister == false) {
      this.openRegister = true;
    } else {
      this.openRegister = false;
    }
  }

}
