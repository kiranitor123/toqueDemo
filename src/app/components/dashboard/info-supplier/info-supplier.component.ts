import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-info-supplier',
  templateUrl: './info-supplier.component.html',
  styleUrls: ['./info-supplier.component.scss']
})
export class InfoSupplierComponent implements OnInit {

  constructor(
    public modalRef: MatDialogRef<InfoSupplierComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  infoAccount: any;

  ngOnInit(): void {
    console.log(this.data);
    this.infoAccount = this.data.bankAccounts;

  }

}
