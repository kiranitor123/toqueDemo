import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StoreService } from '../services/store.service';
import { SupplierService } from '../../supplier/services/supplier.service';
import { TypeConfigService } from '../../type-configurations/services/type-config.service';
import swal from 'sweetalert2';
import { Supplier } from 'src/app/model/supplier.interface';
import { AuthService } from 'src/app/service/auth/auth.service';
import { UserService } from 'src/app/service/user/user.service';
import { zip } from 'rxjs';
import {Business} from '../../../model/business.interface';
@Component({
  selector: 'app-edit-store',
  templateUrl: './edit-store.component.html',
  styleUrls: ['./edit-store.component.scss']
})
export class EditStoreComponent implements OnInit {
  id = '';
  hide = true;
  store?: any;
  businessForm: FormGroup = new FormGroup({});
  listCategories?: any[];
  listSuppliers?: any[];

  listSuppliersObs?: any[];
  listProducts: any = [];
  listAddedSuppliers: any[] = [];
  updateListSupplierOwner: any[] = [];
  loading = false;

  admin!: any;

  file: any;
  imageSrclast: any;
  imageSrc: any;

  constructor(public storeService: StoreService,
              private formBuilder: FormBuilder, private router: Router, private cateServices: TypeConfigService,
              public supplierService: SupplierService, private auth: AuthService,
              private userService: UserService, private route: ActivatedRoute, ) {
    // tslint:disable-next-line:no-non-null-assertion
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.auth.getCurrentUser().subscribe(user => {
      this.admin = user;
    });

  }

  async ngOnInit() {
    this.initializeForm();
    this.getAllCategories();
    this.getAllSuppliers();

    if (this.id) {
      const store = await this.storeService.getByID(this.id);
      this.store = store;
      this.imageSrc = store.image;
      this.businessForm = this.formBuilder.group({
        name: [this.store?.name, [Validators.required]],
        ci: [this.store?.nit, [Validators.required]],
        razon: [this.store?.sosialReason, [Validators.required]],

        userName: ['', []],
        email: ['', []],
        phone: ['', []],
        password: ['', []],
        userCI: ['', []],
      });

      if (store.suppliers.length === 0 ) {
        this.loading = false;
        return;
      }

      const suppliers = store.suppliers.map((supplier: any) => {
        return this.supplierService.getByID(supplier.id);
      });

      // tslint:disable-next-line:no-shadowed-variable
      zip(...suppliers).subscribe((suppliers: any[]) => {
        this.listAddedSuppliers = suppliers;
        this.loading = false;
      });
    }
  }

  initializeForm(): void {
    this.businessForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      ci: ['', [Validators.required]],
      razon: ['', [Validators.required]],

      userName: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userCI: ['', [Validators.required]],
    });
  }

  async getAllCategories() {
    this.listCategories = await this.cateServices.getCategories();

  }

  async getAllSuppliers(){
    this.listSuppliersObs = await this.supplierService.getAll();
  }

  getCategory(cate: any) {
    this.listSuppliers = this.listSuppliersObs?.filter(x => x.categoryId == cate);
  }

  showProducts(supplier: any) {
    this.listProducts = supplier.products;
    this.openModalProducts();
  }

  addSupplier(item: any) {
    const inserted = this.listAddedSuppliers.findIndex((data) => data.id == item.id);
    if (inserted === -1) {
      this.listAddedSuppliers.push(item);
    } else {
      swal.fire({
        title: 'Proveedor ya seleccionado escoja otro',
        icon: 'error',
        showCancelButton: false,
        confirmButtonColor: '#ee4b56',
        confirmButtonText: 'OK'
      });
    }

  }

  deleteProduct(item: Supplier) {
    const index = this.listAddedSuppliers.findIndex((x: Supplier) => x.id === item.id);
    this.listAddedSuppliers.splice(index, 1);
  }

  async updateDataStore() {
    if (this.file){
      this.loading = true;

      const formData: FormData = new FormData();
      formData.append('image', this.file);

      this.storeService.uploadImage(formData).then(image => {

        const supplier: any = this.getBussinesUpdate(image.url);

        this.storeService.update(supplier, this.id).then( (result) => {
          const ids: any[] = this.getSupliersID().filter(x => x != '').map(x => {
            return {
              id: x,
            };
          });
          const data = {
            suppliersIds: ids
          };
          this.storeService.updateSupplier(data, this.id).then(() => {
            this.loading = false;
            swal.fire({
              title: 'Información actualizada!',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#F08302',
              confirmButtonText: 'OK'
            });
            this.router.navigate(['/dashboard/store']);
          }, (error) => {
            this.loading = false;
            console.log('Error component update supplier list-> ', error);
            swal.fire({
              title: 'Error al guardar la información',
              icon: 'error',
              showCancelButton: false,
              confirmButtonColor: '#ee4b56',
              confirmButtonText: 'OK'
            });
          });

        }, (error) => {
          this.loading = false;
          console.log('Error component update store  -> ', error);
          swal.fire({
            title: 'Error al guardar la información',
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: '#ee4b56',
            confirmButtonText: 'OK'
          });
        });
      }, (error) => {
        this.loading = false;
        console.log('Error component image -> ', error);
        swal.fire({
          title: 'Error al guardar la información',
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#ee4b56',
          confirmButtonText: 'OK'
        });
      });
    }else{
      const business: any = this.getBussinesUpdate(this.store?.image);
      this.storeService.update(business, this.id).then( (result) => {
        const ids: any[] = this.getSupliersID().filter(x => x != '').map(x => {
          const data = {
            id: x,
          };
          return data;
        });
        const data = {
          suppliersIds: ids
        };
        this.storeService.updateSupplier(data, this.id).then(() => {
          this.loading = false;
          swal.fire({
            title: 'Información actualizada!',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#F08302',
            confirmButtonText: 'OK'
          });
          this.router.navigate(['/dashboard/store']);
        }, (error) => {
          this.loading = false;
          console.log('Error component update user supplier -> ', error);
          swal.fire({
            title: 'Error al guardar la información',
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: '#ee4b56',
            confirmButtonText: 'OK'
          });
        });

      }, (error) => {
        this.loading = false;
        console.log('Error component create user supplier -> ', error);
        swal.fire({
          title: 'Error al guardar la información',
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#ee4b56',
          confirmButtonText: 'OK'
        });
      });
    }
  }

  generateAcronym(name: string) {
    return name.split(' ').map((x) => {
      return x[0]?.toUpperCase();
    }).join('').substr(0, 2);
  }

  getSupliersID() {
    const sup = [...this.listAddedSuppliers];
    return sup.map(x => x.id).map(x => x ? x : '').filter(x => x != '');
  }


  getBussines(image: string) {
    const { name, ci, razon } = this.businessForm.value;
    const acronym: string = this.generateAcronym(name);
    const supplierIds: string[] = this.getSupliersID();

    const business: any = {
      name,
      nit: ci,
      supplierIds,
      acronym,
      image,
      sosialReason: razon
    };

    return business;
  }

  getBussinesUpdate(image: string) {
    const { name, ci, razon } = this.businessForm.value;
    const acronym: string = this.generateAcronym(name);

    const suplier: any = {
      name,
      nit: ci,
      acronym,
      image,
      sosialReason: razon,
      available: this.store?.available
    };

    return suplier;
  }

  getUser(businessId: string) {
    const { userName, password, email, phone, userCI } = this.businessForm.value;

    const user: any = {

      ci: userCI,
      email,
      username: userName,
      phone: phone + '',
      password,

      businessId,
    };
    return user;
  }

  saveStore() {
    if (this.file){
      this.loading = true;

      const formData: FormData = new FormData();
      formData.append('image', this.file);

      this.storeService.uploadImage(formData).then(image => {

        const business: any = this.getBussines(image.url);
        this.storeService.create(business).then( (result) => {
          const storeId = result.id;
          const user: any = this.getUser(storeId);

          this.userService.createUserOwner(user).then( (result) => {
            this.loading = false;
            swal.fire({
                title: 'Información actualizada!',
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#F08302',
                confirmButtonText: 'OK'
              });


            this.router.navigate(['/dashboard/store']);

          }, (error) => {
            this.loading = false;
            console.log('Error component create user supplier -> ', error);
            swal.fire({
              title: 'Error al guardar la información',
              icon: 'error',
              showCancelButton: false,
              confirmButtonColor: '#ee4b56',
              confirmButtonText: 'OK'
            });
          });
        }, (error) => {
          this.loading = false;
          console.log('Error component create supplier -> ', error);
          swal.fire({
            title: 'Error al guardar la información',
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: '#ee4b56',
            confirmButtonText: 'OK'
          });
        });
      }, (error) => {
        this.loading = false;
        console.log('Error component image supplier -> ', error);
        swal.fire({
          title: 'Error al guardar la información',
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#ee4b56',
          confirmButtonText: 'OK'
        });
      });
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

  openModalProducts() {
    this.storeService.openModalProducts();
  }

  closeModalProducts() {
    this.storeService.closeModalProducts();
  }

  get name() {
    return this.businessForm.get('name');
  }

  get ci() {
    return this.businessForm.get('ci');
  }

  get razon() {
    return this.businessForm.get('razon');
  }

  get userName() {
    return this.businessForm.get('userName');
  }

  get email() {
    return this.businessForm.get('email');
  }

  get password() {
    return this.businessForm.get('password');
  }

  get userCI() {
    return this.businessForm.get('userCI');
  }

  get phone() {
    return this.businessForm.get('phone');
  }

}
