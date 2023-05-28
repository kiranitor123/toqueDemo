import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TimelineItem } from 'ngx-vertical-timeline';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  items: TimelineItem[] = [];
  externalVariable = 'hello';
  datePipeString!: string;
  constructor(
    private datePipe: DatePipe,
    public modalRef: MatDialogRef<HistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit(): void {
    const self = this;
    let created = this.itemGenerator(this.data.created);
 
    this.items.push(created);

    this.data.updated.forEach((elemets:any) => {
      let updated = this.itemGenerator(elemets);
      this.items.push(updated);
    })
 
  }

  itemGenerator(data :any){
    let content = {
      content: this.contentGenerator(data),
      title: this.titleGenerator(data),
    }

    return content;
  }

  contentGenerator(data:any){
    return `usuario : ${data?.username} \n email : ${data?.email}`;
  }

  titleGenerator(data:any){
    let date = this.datePipe.transform(data?.date,'MMM d, y, h:mm:ss a')!;
    return `${date} "${data?.action}"`;
  }



}
