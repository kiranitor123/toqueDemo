import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { QrService } from '../services/qr.service';
import swal from 'sweetalert2';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class QrComponent implements OnInit {

  qrDate: any = null;

  file: any;
  imageSrc: any;
  qr: any;

  loading = false;

  urlCategory = '';

  date = new FormControl(moment());

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  constructor(private qrService: QrService) {}

  async ngOnInit() {
    try {
      this.loading = true;
      this.qr = await this.qrService.getQR();
      this.imageSrc = this.qr.qrCodeImage;
      this.date.setValue(this.getDate(this.qr.validity));
      this.loading = false;
    }catch (error) {
      this.loading = false;
    }

  }

  getDate(dateString: string){
    const dateObj = new Date(dateString);
    return moment(dateObj);

  }



  updateQR() {
    if (this.date.valid) {
      this.loading = true;
      if (this.file){
        const formData: FormData = new FormData();
        formData.append('image', this.file);

        this.qrService.uploadImage(formData).then(
          (image) => {
            const qrDTO: any = {
              validity: new Date(this.date.value).toISOString(),
              qrCodeImage: image.url,
            };

            this.qrService.update(qrDTO, this.qr.id).then(
              (data: any) => {
                this.loading = false;
                swal.fire({
                  title: 'Información guardada!',
                  icon: 'success',
                  showCancelButton: false,
                  confirmButtonColor: '#F08302',
                  confirmButtonText: 'OK',
                });
              },
              () => {
                this.loading = false;
                swal.fire({
                  title: 'Error al guardar datos',
                  icon: 'error',
                  showCancelButton: false,
                  confirmButtonColor: '#ee4b56',
                  confirmButtonText: 'OK',
                });
              }
            );
          },
          () => {
            this.loading = false;
            swal.fire({
              title: 'Error al guardar datos',
              icon: 'error',
              showCancelButton: false,
              confirmButtonColor: '#ee4b56',
              confirmButtonText: 'OK',
            });
          }
        );
      }else{
        const qrDTO: any = {
          validity: new Date(this.date.value).toISOString(),
          qrCodeImage: this.qr.qrCodeImage
        };

        this.qrService.update(qrDTO, this.qr.id).then(
          (data: any) => {
            this.loading = false;
            swal.fire({
              title: 'Información guardada!',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#F08302',
              confirmButtonText: 'OK',
            });
          },
          () => {
            this.loading = false;
            swal.fire({
              title: 'Error al guardar datos',
              icon: 'error',
              showCancelButton: false,
              confirmButtonColor: '#ee4b56',
              confirmButtonText: 'OK',
            });
          }
        );
      }
    }
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    this.preview();
  }
  preview() {
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = (_event) => {
      this.imageSrc = reader.result;
    };
  }
}
