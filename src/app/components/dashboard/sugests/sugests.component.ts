import { MatTableDataSource } from '@angular/material/table';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SugestService } from '../services/sugest.service';

@Component({
  selector: 'app-sugests',
  templateUrl: './sugests.component.html',
  styleUrls: ['./sugests.component.scss']
})
export class SugestsComponent implements OnInit {
  displayedStoresColumns: string[] = [
    'position',
    'name',
    'phone',
    'category',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>();
  constructor(
    public modalRef: MatDialogRef<SugestsComponent>, private sugestServ: SugestService,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.data);
  }

  delete(element:any){
    this.sugestServ.delete(element.id).then(()=>{
      let index = this.data.indexOf((data:any) => data.id == element.id);
      this.data.splice(index,1);
      this.dataSource = new MatTableDataSource<any>(this.data);
    });
  }

}
