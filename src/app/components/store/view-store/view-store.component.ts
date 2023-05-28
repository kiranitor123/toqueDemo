import { Business } from './../../../model/business.interface';
import { AuthService } from 'src/app/service/auth/auth.service';
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { StoreService } from '../services/store.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Admin } from 'src/app/model/admin';
import { MatSelect } from '@angular/material/select';
import { HistoryComponent } from '../../shared/history/history.component';
import { InfoBusinessComponent } from '../../shared/info-business/info-business.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-view-store',
  templateUrl: './view-store.component.html',
  styleUrls: ['./view-store.component.scss'],
})
export class ViewStoreComponent implements OnInit, AfterViewInit {
  public listStores: Array<Business> = [];
  displayedColumns: string[] = [
    'position',
    'storeName',
    'userName',
    'rol',
    'ci',
    'supplier',
    'branchStore',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>();
  displayedStoresColumns: string[] = [
    'position',
    'branchStoreName',
    'address',
  ];
  dataStoresSource: any = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSelect) selector!: MatSelect;
  public loadingMsg: boolean = true;
  public noDataSourceMsg: boolean = false;
  public searchInput: string = '';
  showModal = false;
  public listBranchStores: Array<any>;
  public config: any[] = [
    { name: 'Restaurante', value: 1, activate: true, selected: false },
    { name: 'Encargado', value: 2, activate: true, selected: false },
    { name: 'Rol', value: 3, activate: true, selected: false },
    { name: 'Nit/CI', value: 4, activate: true, selected: false },
    { name: 'Nº P', value: 6, activate: true, selected: false },
    { name: 'Sucursales', value: 8, activate: true, selected: false },
  ];

  public myselection: any;

  user!: any;
  options: any[] = [];

  position = { lat: 0, lng: 0 };
  zoom!:number;
  constructor(public storeService: StoreService, private router: Router, private auth: AuthService,
    public modal: MatDialog,) {
    this.listStores = new Array<any>();
    this.listBranchStores = new Array<any>();
  }

  ngOnInit(): void {
    this.auth.getCurrentUser().subscribe(user => {
      this.user = user;
      this.myselection = this.user.bussinesConfig;
      if(this.myselection?.length > 0){
        this.selectOption(this.user.bussinesConfig);
      }
      
    });
    this.getAllStores();
  }



  updateConfig(config:any[]){
    config.forEach(val => {
      let opt = this.config.find(opt => opt.value == val.value);
      opt.selected = val.selected;
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  
  async save(){
    this.loadingMsg = true;
    const todos = this.options.findIndex((val) => val == 0);

    if (todos >= 0) {
      this.options = [0];
    }

    this.user.bussinesConfig = this.options;

    let update: any = {
      username: this.user.username,
      suppliersConfig: this.user.suppliersConfig,
      bussinesConfig: this.options ,
    }

    this.auth.updateUser(update, this.user.id).then( ()=> {
      this.loadingMsg = false;
      localStorage.setItem('user', JSON.stringify(this.user));
    });

    
  }

  changestatus(item:any){
    Swal.fire({
      title: 'Desea ' + (item.available?'deshabilitar':'habilitar')+ ' este negocio?'+'\n'+item.name,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonColor: '#F08302',
      confirmButtonText: `Si`,
      cancelButtonColor: '#ee4b56',
      denyButtonText: `No`,
      customClass: {
        cancelButton: 'order-1 right-gap',
        confirmButton: 'order-2',
        denyButton: 'order-3',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        let data : any = {
          name: item.name,
          nit: item.nit,
          acronym: item.acronym,
          sosialReason: item.sosialReason,
          image : item.image,
          available: !item.available
        }
        item.available = !item.available;
        this.storeService
          .update(data, item.id).then(() => {
            Swal.fire((data.available?'Habilitado':'Deshabilitado'), '', 'success');
          }, error => {
            console.log('Error in change the status component', error);            
            Swal.fire({
              title: 'Ocurrio un error al intentar cambiar el estado!',
              icon: 'error',
              showCancelButton: false,
              confirmButtonColor: '#ee4b56',
              confirmButtonText: 'OK'
            });
          })
      }
    });
  }

  getAllStores() {
    this.loadingMsg = true;
    this.storeService.getAll().then((response) => {
      this.listStores = response;
      this.loadingMsg = false;
      this.dataSource = new MatTableDataSource<any>(this.listStores);
      this.dataSource.paginator = this.paginator;
      this.noDataSourceMsg =
        this.dataSource.filteredData.length >= 0;
    });
  }

  searchFilter() {
    this.dataSource.filter = this.searchInput.trim().toLowerCase();
    this.noDataSourceMsg =
      this.dataSource.filteredData.length >= 0;
  }

  selectOption(value: any[]) {
   
    const todos = value.findIndex((val) => val == 0);

    if (todos >= 0) {
      this.config.map((val) => {
        val.activate = false;
        return val;
      });
      this.myselection = this.myselection.filter((value: any) => value == 0);
      this.displayedColumns = [
        'position',
        'storeName',
        'userName',
        'rol',
        'ci',
        'supplier',
        'branchStore',
        'actions',
      ];
      this.options = value;
      return;
    }
    if (value.length == 0) {
      this.config.map((val) => {
        val.activate = true;
        return val;
      });
      this.displayedColumns = ['position', 'actions'];
      return;
    }
    this.displayedColumns = ['position'];
    value.forEach((val) => {
      switch (val) {
        case 1:
          this.displayedColumns.push('storeName');
          break;
        case 2:
          this.displayedColumns.push('userName');
          break;
        case 3:
          this.displayedColumns.push('rol');
          break;
        case 4:
          this.displayedColumns.push('ci');
          break;
        case 6:
          this.displayedColumns.push('supplier');
          break;
        case 8:
          this.displayedColumns.push('branchStore');
          break;
        default:
          break;
      }
    });
    this.displayedColumns.push('actions');
    this.options = value;
  }
  getPosition() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.position.lat = position.coords.latitude;
      this.position.lng = position.coords.longitude;
      this.zoom = 14;
    });
  }

  loadMap() {
    const map = new google.maps.Map(
      document.getElementById('map2') as HTMLElement,
      {
        zoom: 14,
        center: this.position,
      }
    );

    this.listBranchStores.map((val) => {
      const marker = new google.maps.Marker({
        position: val.geolocation,
        map: map,
        animation: google.maps.Animation.DROP,
      });
    })

  }


  showBranchStores(item: any) {
    this.getPosition()
    this.listBranchStores = item.branchs;
    this.dataStoresSource = this.listBranchStores;
    this.storeService.openModal();
  }

  
  info(item:any) {
    const modalRef = this.modal.open(HistoryComponent, {
      width: '80%',
      data: item,
    });
  }

  infoBusiness(item:any) {
    const modalRef = this.modal.open(InfoBusinessComponent, {
      width: '80%',
      data: item,
    });
  }

  closeModal() {
    this.storeService.closeModal();
  }

  editStore(item: any) {
    this.router.navigate(['/store/edit', item.id]);
  }

  deleteStore(item: any) {
    Swal.fire({
      title: 'Desea eliminar la tienda?'+'\n'+item.name,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonColor: '#F08302',
      confirmButtonText: `Si`,
      cancelButtonColor: '#ee4b56',
      denyButtonText: `No`,
      customClass: {
        cancelButton: 'order-1 right-gap',
        confirmButton: 'order-2',
        denyButton: 'order-3',
      },
    }).then((result) => {
      if (result.isConfirmed) {
         this.storeService
          .delete(item.id)
          .then(() => {
            this.getAllStores()
            Swal.fire({
              title: 'Eliminado',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#F08302',
              confirmButtonText: 'OK'
            });
          })
          .catch(() => {
            console.log('Error deleting store component');
            Swal.fire({
              title: 'Ocurrio un error al eliminar!',
              icon: 'error',
              showCancelButton: false,
              confirmButtonColor: '#ee4b56',
              confirmButtonText: 'OK'
            });
          }); 
      }
    });
  }
}
