import { Admin } from 'src/app/model/admin';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TypeConfigService } from '../../services/type-config.service';
import swal from 'sweetalert2'
import { Category } from 'src/app/model/category.interface';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {
  public uid: string = '';
  public categoryForm!: FormGroup;
  public createdCateMsg = false
  public messageText = '';
  public initDate: any = null;

  file: any;
  imageSrclast: any;
  imageSrc: any;
  id:string;
  admin!:Admin;
  category!: Category;

  loading: boolean = false;

  urlCategory: string = '';
  constructor(private formBuilder: FormBuilder, private typeConfigService: TypeConfigService,private route: ActivatedRoute,
    private router: Router, private auth: AuthService) { 
      this.id = this.route.snapshot.paramMap.get('id')!;
      this.auth.getCurrentUser().subscribe(user => {
        this.admin = user;
      });
    }

  ngOnInit(): void {
    this.initializeForm();
    if(this.id){
      this.typeConfigService.getByID(this.id).then(cat =>{
        if(cat){
          this.category = cat;
          this.urlCategory = cat.image;
          this.imageSrc = cat.image;
          this.categoryForm = this.formBuilder.group({
            name: [cat.name, [Validators.required]],
          }) 
        }
      });
    }
  }

  initializeForm() {
    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required]],
    })
  }

  updateCategory() {
    if (this.categoryForm.valid) {
      this.loading = true;
      if(this.file){
        var formData: FormData = new FormData();
        formData.append('image', this.file);
        
        this.typeConfigService.uploadCategoryImage(formData).then(
          (image) => {
            let categoryDTO: any = {
              name: this.name?.value,
              image: image.url,
            };
  
            this.typeConfigService.update(categoryDTO, this.id).then(
              (data: any) => {
                this.loading = false;
                swal.fire({
                  title: 'Información guardada!',
                  icon: 'success',
                  showCancelButton: false,
                  confirmButtonColor: '#F08302',
                  confirmButtonText: 'OK',
                });
                this.categoryForm.reset();
                this.imageSrc = '';
                this.router.navigate(['/category']);
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
        let categoryDTO: any = {
          name: this.name?.value,
          image: this.urlCategory,
        };

        this.typeConfigService.update(categoryDTO, this.uid).then(
          (data: any) => {
            this.loading = false;
            swal.fire({
              title: 'Información guardada!',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#F08302',
              confirmButtonText: 'OK',
            });
            this.categoryForm.reset();
            this.imageSrc = '';
            this.router.navigate(['/category']);
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
      this.categoryForm.markAllAsTouched();
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

  saveCategory() {
    if (this.categoryForm.valid && this.file) {
      this.loading = true;
      var formData: FormData = new FormData();
      formData.append('image', this.file);
      this.typeConfigService.uploadCategoryImage(formData).then(
        (image) => {
          let categoryDTO: any = {
            name: this.name?.value,
            image: image.url,
          };

          this.typeConfigService.create(categoryDTO).then(
            (data: any) => {
              this.loading = false;
              swal.fire({
                title: 'Información guardada!',
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#F08302',
                confirmButtonText: 'OK',
              });
              this.categoryForm.reset();
              this.imageSrc = '';
              this.router.navigate(['/category']);
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
      this.categoryForm.markAllAsTouched();
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
    return this.categoryForm.get('name');
  }

  onFileSelected(event:any) {
    this.file = event.target.files[0];
    this.preview();
  }
  preview() {
    var reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = (_event) => {
      this.imageSrc = reader.result;
    };
  }
}
