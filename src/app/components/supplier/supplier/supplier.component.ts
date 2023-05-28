import { InfoBusinessComponent } from './../../shared/info-business/info-business.component';
import { HistoryComponent } from './../../shared/history/history.component';
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Inject,
  Input,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SupplierService } from '../services/supplier.service';
import swal from 'sweetalert2';
import { Admin } from 'src/app/model/admin';
import { AuthService } from 'src/app/service/auth/auth.service';
import { TypeConfigService } from '../../type-configurations/services/type-config.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss'],
})
export class SupplierComponent implements OnInit, AfterViewInit {
  constructor(public supplierService: SupplierService, private auth: AuthService, public modal: MatDialog,
              private cateService: TypeConfigService) {
      this.activeLink = 'Todos';
    }

  displayedColumns: string[] = [
    'position',
    'name',
    'logo',
    'category',
    'acro',
    'phone',
    'products',
    'actions',
  ];
  public listSupplier: any = [];
  dataSource = new MatTableDataSource<any>(this.listSupplier);
  displayedSupplierColumns: string[] = ['position', 'name', 'price', 'unit'];
  dataSupplierSource = new MatTableDataSource<any>();
  public noProductsMsg = false;
  public searchInput = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public loadingMsg = true;
  public noDataSourceMsg = false;

  public config: any[] = [
    { name: 'Proveedor', value: 1, activate: true, selected: false },
    { name: 'Encargado', value: 2, activate: true, selected: false },
    { name: 'Categorìa', value: 3, activate: true, selected: false },
    { name: 'Correo', value: 4, activate: true, selected: false },
    { name: 'Telèfono', value: 5, activate: true, selected: false },
    { name: 'Productos', value: 6, activate: true, selected: false },
  ];

  public myselection: any;

  activeLink!: string;
  user!: any;
  options: any[] = [];

  categories: any[] = [];

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.auth.getCurrentUser().subscribe(user => {
      this.user = user;
      this.myselection = this.user.suppliersConfig;
      if (this.myselection?.length > 0){
        this.selectOption(this.user.suppliersConfig);
      }
    });
    this.getSuppliers();
    this.getAllCategories();
  }

  getAllCategories(){
    this.cateService.getCategories().then((response) => {
      this.categories = response;
    });
  }

  showAll(){
    this.activeLink = 'Todos';
    this.dataSource = new MatTableDataSource<any>(this.listSupplier);
  }


  filter(cat: any){
    this.activeLink = cat.id;
    const newData = this.listSupplier.filter((item: any) => item.categoryId == cat.id);
    this.dataSource = new MatTableDataSource<any>(newData);

  }

  async save(){
    this.loadingMsg = true;
    const todos = this.options.findIndex((val) => val == 0);

    if (todos >= 0) {
      this.options = [0];
    }

    this.user.suppliersConfig = this.options;

    const update: any = {
      username: this.user.username,
      suppliersConfig: this.options,
      bussinesConfig: this.user.bussinesConfig,
    };

    this.auth.updateUser(update, this.user.id).then( () => {
      this.loadingMsg = false;
      localStorage.setItem('user', JSON.stringify(this.user));
    });


  }

  changestatus(item: any){
    swal.fire({
      title: 'Desea ' + (item.available ? 'deshabilitar' : 'habilitar') + ' este proveedor?' + '\n' + item.name,
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
        const data: any = {
          name: item.name,
          phone: item.phone,
          acronym: item.acronym,
          image : item.image,
          deliveryData: item.deliveryData,
          address: item.address,
          geolocation: item.geolocation,
          available: !item.available
        };
        item.available = !item.available;
        this.supplierService
          .update(data, item.id).then(() => {
            swal.fire((data.available ? 'Habilitado' : 'Deshabilitado'), '', 'success');
          }, error => {
            console.log('Error in change the status component', error);
            swal.fire({
              title: 'Ocurrio un error al intentar cambiar el estado!',
              icon: 'error',
              showCancelButton: false,
              confirmButtonColor: '#ee4b56',
              confirmButtonText: 'OK'
            });
          });
      }
    });
  }

  getSuppliers() {
    this.loadingMsg = true;
    this.supplierService.getAll().then((response) => {
      const suppliers = response;
      this.loadingMsg = false;
      this.listSupplier = suppliers;
      this.dataSource = new MatTableDataSource<any>(suppliers);
      this.dataSource.paginator = this.paginator;
      this.noDataSourceMsg =
        this.dataSource.filteredData.length == 0 ? true : false;
    });
  }

  info(item: any) {
    const modalRef = this.modal.open(HistoryComponent, {
      width: '80%',
      data: item,
    });
  }

  infoBusiness(item: any) {
    const modalRef = this.modal.open(InfoBusinessComponent, {
      width: '80%',
      data: item,
    });
  }

  displayProducts(item: any) {
    this.noProductsMsg = item.products.length == 0;
    this.dataSupplierSource = new MatTableDataSource<any>(item.products);
    this.supplierService.openModal();
  }

  closeModal() {
    this.supplierService.closeModal();
  }

  deleteSupplier(item: any) {
    swal
      .fire({
        title: 'Desea eliminar al proveedor?' + item.name,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: `Si`,
        denyButtonText: `No`,
        customClass: {
          cancelButton: 'order-1 right-gap',
          confirmButton: 'order-2',
          denyButton: 'order-3',
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          // delete item
           this.supplierService
            .delete(item.id)
            .then((response) => {
              this.getSuppliers();
              swal.fire({
                title: 'Eliminado!',
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#F08302',
                confirmButtonText: 'OK'
              });
            })
            .catch((error) => {
              console.error('Error deleting supplier component -> ', error);
              swal.fire({
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

  searchFilter() {
    this.dataSource.filter = this.searchInput.trim().toLowerCase();
    this.noDataSourceMsg =
      this.dataSource.filteredData.length == 0 ? true : false;
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
        'name',
        'logo',
        'category',
        'acro',
        'phone',
        'products',
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
          this.displayedColumns.push('name');
          break;
        case 2:
          this.displayedColumns.push('logo');
          break;
        case 3:
          this.displayedColumns.push('category');
          break;
        case 4:
          this.displayedColumns.push('acro');
          break;
        case 5:
          this.displayedColumns.push('phone');
          break;
        case 6:
          this.displayedColumns.push('products');
          break;
        default:
          break;
      }
    });
    this.displayedColumns.push('actions');
    this.options = value;
  }
}
