import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AdsUpdateDTO } from 'src/app/model/ads';
import Swal from 'sweetalert2';
import { HistoryComponent } from '../../shared/history/history.component';
import { AdsService } from '../services/ads.service';

@Component({
  selector: 'app-view-ads',
  templateUrl: './view-ads.component.html',
  styleUrls: ['./view-ads.component.scss']
})
export class ViewAdsComponent implements OnInit {
  public listAds: Array<any> = new Array<any>();
  displayedColumns: string[] = [
    'position',
    'name',
    'image',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>();

  dataAdsSource: any = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public loadingMsg: boolean = true;
  public noDataSourceMsg: boolean = false;
  public searchInput: string = '';

  public myselection: any;
  constructor(
    private adsStoreService: AdsService,
     private router: Router,
     public modal: MatDialog) {
  }

  ngOnInit(): void {
    this.getAllAds();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAllAds() {
    this.loadingMsg = true;
     this.adsStoreService.getAds().then((response) => {
      this.listAds = response;

      this.loadingMsg = false;
      this.dataSource = new MatTableDataSource<any>(this.listAds);
      this.dataSource.paginator = this.paginator;
      this.noDataSourceMsg =
        this.dataSource.filteredData.length == 0 ? true : false;
    });  
  }

  info(item:any) {
    const modalRef = this.modal.open(HistoryComponent, {
      width: '80%',
      data: item,
    });
  }

  searchFilter() {
    this.dataSource.filter = this.searchInput.trim().toLowerCase();
    this.noDataSourceMsg =
      this.dataSource.filteredData.length == 0 ? true : false;
  }

  editAds(item: any) {
    this.router.navigate(['/ads/edit', item.id]);
  }

  changestatus(item:any){
    Swal.fire({
      title: 'Desea ' + (item.available?'deshabilitar':'habilitar')+ ' esta publicidad?'+'\n'+item.name,
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
        let data : AdsUpdateDTO = {
          name: item.name,
          image : item.image,
          available: !item.available
        }
        item.available = !item.available;
        this.adsStoreService
          .updateStatus(data, item.id).then(() => {
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

  deleteAds(item: any) {
    Swal.fire({
      title: 'Desea eliminar la publicidad?'+'\n'+item.name,
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
        //delete item
         this.adsStoreService
          .delete(item.id).then(data=>{
            Swal.fire({
              title: 'Eliminado',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#F08302',
              confirmButtonText: 'OK'
            });

            this.getAllAds();
          }, error => {
            console.log('Error deleting ads component');            
            Swal.fire({
              title: 'Ocurrio un error al eliminar!',
              icon: 'error',
              showCancelButton: false,
              confirmButtonColor: '#ee4b56',
              confirmButtonText: 'OK'
            });
          }) 
      }
    });
  }
}
