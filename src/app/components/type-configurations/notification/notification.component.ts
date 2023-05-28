import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
import { UserService } from 'src/app/service/user/user.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  public notificationForm!: FormGroup;
  owners: any[] = [];
  suppliers: any[] = [];

  ids: any[] = [];
  constructor(private formBuilder: FormBuilder, private userServ: UserService) { }

  async ngOnInit() {
    this.userServ.listaAllUsers().then(res => {
      this.owners = res.owners;

      this.owners.map(async element => {
        let managers = await this.userServ.listAllManagers(element.business.id);
        element.managers = managers;
        return element;
      })
      this.suppliers = res.suppliers;
      console.log(res);
      console.log(this.owners);
    })
    this.notificationForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      message: ['', [Validators.required]],
    });
  }

  sendNotification() {  
    let data = {
      title: this.notificationForm.value.title,
      body: this.notificationForm.value.message,
      ids: this.ids,
      data: {
        action: "INFO"
      }
    }

    this.userServ.sendNotification(data).then(res => {
      this.userServ.listaAllUsers().then(res => {
        this.owners = res.owners;
        this.suppliers = res.suppliers;
      })
      this.notificationForm.reset();
      this.ids = [];
      Swal.fire({
        title: 'Notificación enviada',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: '#F08302',
        confirmButtonText: 'OK'
      });
    })

  }

  onChange(event:boolean, id:string) {
    if(event) {
      this.ids.push(id);
    }
    else{
      const index = this.ids.indexOf(id);
      this.ids.splice(index, 1);
    }
  }

  get title() {
    return this.notificationForm.get('title');
  }

  get message() {
    return this.notificationForm.get('message');
  }
}
