import { LocationDTO, SupplierDTO } from './../../../model/supplier.interface';
import { UserService } from './../../../service/user/user.service';
import { Observable, zip } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from 'src/app/model/category.interface';
import { Product, ProductDTO } from 'src/app/model/product.interface';
import { TypeConfigService } from '../../type-configurations/services/type-config.service';
import { SupplierService } from '../services/supplier.service';
import swal from 'sweetalert2';
import { DeliveryDTO, Supplier } from 'src/app/model/supplier.interface';
import { UUID } from 'angular2-uuid';
import { Addres } from 'src/app/model/addres';
import { Admin } from 'src/app/model/admin';
import { AuthService } from 'src/app/service/auth/auth.service';
import * as firebase from 'firebase/app';
import { InfoUser } from 'src/app/model/info';
import { User, UserSupplier } from 'src/app/model/user.interface';

import * as XLSX from 'xlsx';
@Component({
  selector: 'app-edit-supplier',
  templateUrl: './edit-supplier.component.html',
  styleUrls: ['./edit-supplier.component.scss'],
})
export class EditSupplierComponent implements OnInit {
  supplierForm!: FormGroup;
  userForm!: FormGroup;

  dayOfWeek: any[] = [
    {
      label: 'Lunes',
      abr: 'Lun',
      active: false,
    },
    {
      label: 'Martes',
      abr: 'Mar',
      active: false,
    },
    {
      label: 'Miercoles',
      abr: 'Mie',
      active: false,
    },
    {
      label: 'Jueves',
      abr: 'Jue',
      active: false,
    },
    {
      label: 'Viernes',
      abr: 'Vie',
      active: false,
    },
    {
      label: 'Sabado',
      abr: 'Sab',
      active: false,
    },
    {
      label: 'Domingo',
      abr: 'Dom',
      active: false,
    },
  ];
  alldays: string[] = [
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado',
    'Domingo',
  ];

  model: any = { phone_number: '' };
  displayedColumns: string[] = ['position', 'name', 'price', 'unit', 'action'];

  public listProducts!: Array<any>;
  public listCategories!: any[];
  public selectCategory: any;
  dataSource = new MatTableDataSource<any>(this.listProducts);
  public noProductAddedMsg = true;
  public newProduct: any = {};
  public listSuppliers: any = [];
  public categoryEdit = '';
  public id = '';

  public urlLogoImage = '';

  public allDay = false;
  public openHour: any;
  public closeHour: any;
  times: any;
  timeError = false;
  public ListDays: any = [];
  public listHours: any = [];
  public cont = 0;

  listDaysAtention: DeliveryDTO[] = [];
  displayedAtentionColumns: string[] = ['days', 'hours', 'actions'];
  dataAtentionSource = new MatTableDataSource<DeliveryDTO>(this.listDaysAtention);

  msgErrorImg = false;
  public noHoursAddedMsg = true;

  public position = { lat: 0, lng: 0 };
  hide: any = true;
  hide2: any = true;
  passwordNoMatched = false;
  public displayLoading = false;

  file: any;
  imageSrclast: any;
  imageSrc: any;

  supplier?: Supplier;

  arrayBuffer: any;
  constructor(
    private formBuilder: FormBuilder,
    private typeConfigService: TypeConfigService,
    private supplierService: SupplierService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
  ) {

    // tslint:disable-next-line:no-non-null-assertion
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.listProducts = [];
  }

  compareObjects(o1: any, o2: any): boolean {
    return ( o1.id === o2.id );
  }

  incomingfile(event: any): void {
    this.file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();
      for (let i = 0; i !== data.length; ++i) { arr[i] = String.fromCharCode(data[i]); }
      const bstr = arr.join('');
      const workbook = XLSX.read(bstr, { type: 'binary' });
      // tslint:disable-next-line:variable-name
      const first_sheet_name = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[first_sheet_name];
      const va: excel[] = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      const prod = va.map(element => {
        const product: Product = {
          name: element.Nombre,
          price: element.Precio,
          unit: element.Medida,
        };

        return product;
      });

      this.noProductAddedMsg = prod.length === 0;
      this.listProducts.push(...prod);
      this.dataSource = new MatTableDataSource<any>(this.listProducts);
    };
    fileReader.readAsArrayBuffer(this.file);
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getCategories();
    this.getPosition();

    if (this.id){
      this.supplierService.getByID(this.id).then( data => {
        this.supplier = data;
        this.position.lat = data.geolocation?.lat;
        this.position.lng = data.geolocation?.lng;
        this.position.lat ??= 0;
        this.position.lng ??= 0;
        this.loadMap();
        this.urlLogoImage = data.image;
        this.setDeliveryDate(data.deliveryData);
        this.cont++;
        this.listProducts = data.products as Product[];
        this.dataSource = new MatTableDataSource<any>(this.listProducts);
        this.noProductAddedMsg = false;
        this.typeConfigService.getByID(data.categoryId).then( category => {
          this.supplierForm = this.formBuilder.group({
            name: [data.name, [Validators.required]],
            address: [data.address, [Validators.required]],
            phone: [data.phone, [Validators.required]],
            category: [category, [Validators.required]],
            deliveryDate: ['', []],

            username: ['', []],
            email: ['', []],
            userphone: ['', []],
            password: ['', []],
            ci: ['', []],
          });
        });

      });
    }
  }


  initializeForm(): void {
    this.supplierForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      category: ['', [Validators.required]],
      deliveryDate: ['', []],

      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      userphone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      ci: ['', []],
    });
  }

  setDeliveryDate(dates: DeliveryDTO[]): void {
    if (this.cont < 1) {
      for (const date of dates) {
        const atention: DeliveryDTO = {
          days : date.days,
          schedule : date.schedule
        };


        this.listDaysAtention.push(atention);
      }
      this.dataAtentionSource = new MatTableDataSource<DeliveryDTO>(
        this.listDaysAtention
      );

      this.noHoursAddedMsg = false;
    }
  }

  getPosition(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.position.lat = position.coords.latitude;
      this.position.lng = position.coords.longitude;

      this.loadMap();
    });
  }

  loadMap(): void {
    const map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        zoom: 14,
        center: this.position,
      }
    );
    const marker = new google.maps.Marker({
      position: this.position,
      map,
      draggable: true,
      animation: google.maps.Animation.DROP,
    });

    marker.addListener('dragend', (event) => {
      this.position.lat = event.latLng.lat();
      this.position.lng = event.latLng.lng();
    });
  }

  async getCategories(): Promise<void> {
    this.listCategories = await this.typeConfigService.getCategories();
  }

  handleDay(day: any): void {
    day.active = !day.active;
    if (day.active) {
      this.ListDays.push(day.label);
    } else {
      this.ListDays.splice(day.label, 1);
    }
  }

  handleAllDays(checked: any): void {
    this.ListDays = checked ? this.alldays : [];
    this.dayOfWeek.map((day) => {
      day.active = checked;
      return day;
    });
  }

  timeSelected(data: any): void{
    this.times = data;
  }

  addAtention(): void {
    if (this.times && this.ListDays.length > 0){
      const days = this.ListDays.join(', ');
      const atention: DeliveryDTO = {
        days,
        schedule: this.times
      };

      this.listDaysAtention.push(atention);
      this.dataAtentionSource = new MatTableDataSource<DeliveryDTO>(
        this.listDaysAtention
      );
      this.noHoursAddedMsg = false;
      this.ListDays = [];

      this.dayOfWeek.map((day) => {
        day.active = false;
        return day;
      });

      this.allDay = false;
    }else{
      if (!this.times){
        swal.fire({
          title: 'Error se requiere un horario',
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#ee4b56',
          confirmButtonText: 'OK'
        });
      }else{
        swal.fire({
          title: 'Error se que seleccione algun dia',
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#ee4b56',
          confirmButtonText: 'OK'
        });
      }

    }

  }

  removeAtention(item: any): void {
    const index = this.listDaysAtention.findIndex(
      (x: any) => x.days === item.days
    );
    this.listDaysAtention.splice(index, 1);
    this.dataAtentionSource = new MatTableDataSource<DeliveryDTO>(
      this.listDaysAtention
    );
    if (this.listDaysAtention.length === 0) {
      this.noHoursAddedMsg = true;
    }
  }

  addProduct(): void {
    if (this.newProduct.name?.trim().length > 0) {
      this.listProducts.push(this.newProduct);
      this.dataSource = new MatTableDataSource<any>(this.listProducts);
      this.noProductAddedMsg = false;
      this.newProduct = {};
    }
  }

  removeProduct(item: any): void {
    this.listProducts.splice(item, 1);
    this.dataSource = new MatTableDataSource<any>(this.listProducts);
  }

  generateAcronym(name: string): string {
    return name.split(' ').map((x) => {
      return  x[0]?.toUpperCase();
    }).join('').substr(0, 2);
  }

  convertUserInfo(admin: Admin, action: string): any{
    const userInfo: InfoUser = {username: admin.username, action, email: admin.email, date: firebase.default.firestore.Timestamp.now()};
    return userInfo;
  }

  getUser(supplierId: string): UserSupplier {
    const {username, email, password, userphone, ci} = this.supplierForm.value;
    const user: UserSupplier = {
      ci,
      email,
      username,
      phone: userphone,
      supplierId,
      password
    };
    return user;
  }

  getSupplier(image: string): SupplierDTO {
    const {category, name, address, phone} = this.supplierForm.value;

    const geolocation: LocationDTO = {lat: this.position.lat, lng: this.position.lng};
    const acronym: string = this.generateAcronym(name);

    const suplier: SupplierDTO = {
      name,
      acronym,
      address,
      image,
      phone,
      deliveryData: this.listDaysAtention,
      categoryId: category.id,
      geolocation
    };

    return suplier;
  }
  getSupplierUpdate(image: string): any {
    const {category, name, address, phone} = this.supplierForm.value;

    const geolocation: LocationDTO = {lat: this.position.lat, lng: this.position.lng};
    const acronym: string = this.generateAcronym(name);

    const suplier: any = {
      name,
      acronym,
      address,
      image,
      phone,
      deliveryData: this.listDaysAtention,
      categoryId: category.id,
      geolocation,
      available: true
    };

    return suplier;
  }


  async save(): Promise<void> {
    if (this.file){
      this.displayLoading = true;

      const formData: FormData = new FormData();
      formData.append('image', this.file);

      this.supplierService.uploadImage(formData).then(image => {

        const supplier: SupplierDTO = this.getSupplier(image.url);

        this.supplierService.create(supplier).then( (result) => {
          const supplierID = result.id;
          const user: UserSupplier = this.getUser(supplierID);
          this.saveProducts(supplierID);
          this.userService.createUserSupplier(user).then( () => {
            this.displayLoading = false;
            swal.fire({
                title: 'Información actualizada!',
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#F08302',
                confirmButtonText: 'OK'
              });


            this.router.navigate(['/dashboard/supplier']);

          }, (error) => {
            this.displayLoading = false;
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
          this.displayLoading = false;
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
        this.displayLoading = false;
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

  saveProducts(id: string): void {
    const products: ProductDTO[] = this.listProducts.map((x: Product) => {
      return {
        name: x.name,
        price: x.price,
        unit: x.unit,
        supplierId: id,
      };
    });
    products.forEach(async (product: ProductDTO) => {
      await this.supplierService.createProduct(product);
    });

  }

  async updateSupplier(): Promise<void> {
    if (this.file){
      this.displayLoading = true;

      const formData: FormData = new FormData();
      formData.append('image', this.file);

      this.supplierService.uploadImage(formData).then(image => {

        const supplier: any = this.getSupplierUpdate(image.url);

        this.supplierService.update(supplier, this.id).then( (result) => {
          this.displayLoading = false;
          swal.fire({
              title: 'Información actualizada!',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#F08302',
              confirmButtonText: 'OK'
            });
          this.router.navigate(['/dashboard/supplier']);
        }, (error) => {
          this.displayLoading = false;
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
        this.displayLoading = false;
        console.log('Error component image supplier -> ', error);
        swal.fire({
          title: 'Error al guardar la información',
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#ee4b56',
          confirmButtonText: 'OK'
        });
      });
    }else{
      const supplier: any = this.getSupplierUpdate(this.urlLogoImage);
      this.supplierService.update(supplier, this.id).then( (result) => {
        this.displayLoading = false;
        swal.fire({
            title: 'Información actualizada!',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#F08302',
            confirmButtonText: 'OK'
          });
        this.router.navigate(['/dashboard/supplier']);
      }, (error) => {
        this.displayLoading = false;
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

  onFileSelected(event: any): void {
    this.file = event.target.files[0];
    this.preview();
  }
  preview(): void {
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      this.imageSrc = reader.result;
    };
  }

  // Supplier Form
  get name(): any {
    return this.supplierForm.get('name');
  }

  get phone(): any  {
    return this.supplierForm.get('phone');
  }

  get address(): any  {
    return this.supplierForm.get('address');
  }

  get category(): any  {
    return this.supplierForm.get('category');
  }

  // User Form

  get username(): any  {
    return this.supplierForm.get('username');
  }

  get email(): any  {
    return this.supplierForm.get('email');
  }

  get password(): any  {
    return this.supplierForm.get('password');
  }

  get userphone(): any  {
    return this.supplierForm.get('userphone');
  }

  get ci(): any  {
    return this.supplierForm.get('ci');
  }
}

// tslint:disable-next-line:class-name
export interface excel {
  uid: string;
  Nombre: string;
  Precio: number;
  Medida: string;
}
