import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-info-business',
  templateUrl: './info-business.component.html',
  styleUrls: ['./info-business.component.scss']
})
export class InfoBusinessComponent implements OnInit {

  owner: any;
  supplier:boolean = false;
  displayedAtentionColumns: string[] = ['days', 'hours'];
  constructor(
    public modalRef: MatDialogRef<InfoBusinessComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit(): void {
    if(this.data.supplierUser){
      this.owner = this.data.supplierUser;
      this.owner.image??= './assets/image/user.png';
      this.supplier = true;
    }else if(this.data.owner){
      this.owner = this.data.owner;
      this.owner.image??= './assets/image/user.png';
      this.data.sosialReason ??= 'No hay información';
    }

    this.data.image ??= './assets/image/business.png';
  }

}
