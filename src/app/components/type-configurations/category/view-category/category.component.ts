import { HistoryComponent } from './../../../shared/history/history.component';
import { OnInit, AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TypeConfigService } from '../../services/type-config.service';
import { Category } from 'src/app/model/category.interface';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';
import { Admin } from 'src/app/model/admin';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, AfterViewInit {
  public listCategories!: Array<Category>;
  displayedColumns: string[] = ['position', 'name', 'logo', 'actions'];
  dataSource = new MatTableDataSource<Category>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public loadingMsg: boolean = true;
  public noDataSourceMsg: boolean = false;
  public searchInput = "";

  admin!:Admin;
  constructor(private typeConfigService: TypeConfigService, private router: Router, 
    public modal: MatDialog,
    private auth: AuthService) {
    this.listCategories = new Array<Category>();
    this.auth.getCurrentUser().subscribe(user => {
      this.admin = user;
    });
  }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(){
    this.typeConfigService.getCategories().then(
      (response) => {
        this.loadingMsg = false
        this.listCategories = response;
        this.dataSource = new MatTableDataSource<Category>(this.listCategories);
        this.dataSource.paginator = this.paginator;
        this.noDataSourceMsg = this.dataSource.filteredData.length == 0;
      })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  deleteCategory(category: any) {

    Swal.fire({
      title: 'Desea eliminar la categoria?'+'\n'+category.name,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonColor: '#F08302',
      confirmButtonText: `Si`,
      cancelButtonColor: '#ee4b56',
      denyButtonText: `No`,
    }).then((result) => {
       if (result.isConfirmed) {
        this.typeConfigService.delete(category.id).then(
          (response: any) => {       
            this.getAll();     
            Swal.fire({
              title: 'Categoria eliminada',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#F08302',
              confirmButtonText: 'OK'
            });
          }
        ).catch((error: any) => {
          console.log('Error deleting category -> ', error)          
          Swal.fire({
            title: 'Ocurrio un error al eliminar!',
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: '#ee4b56',
            confirmButtonText: 'OK'
          });
        }) 
      }
    })
  }

  editCategory(category: any){
    this.router.navigate(['/category/edit', category.id]);
  }

  searchFilter() {
    this.dataSource.filter = this.searchInput.trim().toLowerCase();
    this.noDataSourceMsg = this.dataSource.filteredData.length == 0 ? true : false
  }

  info(item:any) {
    const modalRef = this.modal.open(HistoryComponent, {
      width: '80%',
      data: item,
    });
  }
}
