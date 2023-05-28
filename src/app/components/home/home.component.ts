import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  range: FormGroup = new FormGroup({});
  constructor(private formBuilder: FormBuilder ) {
    this.range = this.formBuilder.group({
      start: [new Date(), []],
      end: [new Date(), []],
    })
   }

  ngOnInit(): void {
  }

  update(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log(`${type}: ${event.value}`)

  }

}
