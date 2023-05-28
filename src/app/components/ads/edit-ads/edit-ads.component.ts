import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdsDTO } from 'src/app/model/ads';
import { ImageUpload } from 'src/app/model/image';
import swal from 'sweetalert2';
import { AdsService } from '../services/ads.service';

@Component({
  selector: 'app-edit-ads',
  templateUrl: './edit-ads.component.html',
  styleUrls: ['./edit-ads.component.scss'],
})
export class EditAdsComponent implements OnInit {
  uid: string = '';
  hide = true;
  hide1 = true;
  ads: any;
  urlAds: string = '';
  adsForm: FormGroup = new FormGroup({});
  errorUpdatingMsg: boolean = false;
  updatedMsg: boolean = false;

  loading: boolean = false;

  file: any;

  imageSrc: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private adsService: AdsService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.activatedRoute.params.subscribe((response) => {
      this.uid = response.id;

      if (this.uid) {
          this.adsService.getByID(this.uid).then(
            (response: any) => {
              this.adsForm = this.formBuilder.group({
                name: [response.name, [Validators.required]],
              })
              this.imageSrc = response.image;
              this.urlAds = response.image;
            }
          )
        }
    });
  }

  initializeForm() {
    this.adsForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      file: [null],
    });
  }

  async uploadImgAds(e: any) {
    this.file = e.target.files[0];
    this.preview();
  }

  preview() {
    var reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = (_event) => {
      this.imageSrc = reader.result;
    };
  }

  updateAds() {
    if (this.adsForm.valid) {
      this.loading = true;
      if(this.file){
        var formData: FormData = new FormData();
        formData.append('image', this.file);
        
        this.adsService.uploadAdsImage(formData).then(
          (image) => {
            let adsDTO: AdsDTO = {
              name: this.name?.value,
              image: image.url,
            };
  
            this.adsService.update(adsDTO, this.uid).then(
              (data: any) => {
                this.loading = false;
                swal.fire({
                  title: 'Información guardada!',
                  icon: 'success',
                  showCancelButton: false,
                  confirmButtonColor: '#F08302',
                  confirmButtonText: 'OK',
                });
                this.adsForm.reset();
                this.imageSrc = '';
                this.router.navigate(['/ads']);
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
        let adsDTO: AdsDTO = {
          name: this.name?.value,
          image: this.urlAds,
        };

        this.adsService.update(adsDTO, this.uid).then(
          (data: any) => {
            this.loading = false;
            swal.fire({
              title: 'Información guardada!',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#F08302',
              confirmButtonText: 'OK',
            });
            this.adsForm.reset();
            this.imageSrc = '';
            this.router.navigate(['/ads']);
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
     
    } else {
      this.adsForm.markAllAsTouched();
      if (!this.file) {
        swal.fire({
          title: 'Se requiere imagen',
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#ee4b56',
          confirmButtonText: 'OK',
        });
      }
    }
  }

  saveAds() {
    if (this.adsForm.valid && this.file) {
      this.loading = true;
      var formData: FormData = new FormData();
      formData.append('image', this.file);
      this.adsService.uploadAdsImage(formData).then(
        (image) => {
          let adsDTO: AdsDTO = {
            name: this.name?.value,
            image: image.url,
          };

          this.adsService.createAds(adsDTO).then(
            (data: any) => {
              this.loading = false;
              swal.fire({
                title: 'Información guardada!',
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#F08302',
                confirmButtonText: 'OK',
              });
              this.adsForm.reset();
              this.imageSrc = '';
              this.router.navigate(['/ads']);
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
    } else {
      this.adsForm.markAllAsTouched();
      if (!this.file) {
        swal.fire({
          title: 'Se requiere imagen',
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#ee4b56',
          confirmButtonText: 'OK',
        });
      }
    }
  }

  get name() {
    return this.adsForm.get('name');
  }
}
