import { Addres } from './addres';
import { InfoUser } from './info';
import { Product } from './product.interface';

export interface Supplier {
    id?: string;
    name: string;
    acronym:string;
    phone: number;
    addres: Addres;
    image?: any;
    product: Product[];
    deleted: boolean;
    deliveryDate: [];
    created: InfoUser;
    updated: InfoUser[];
    categorieID: string;
    categorieName:string;
    ownerID: string;
    ownerName: string;
    status: boolean;
}

export interface SupplierDTO {
    name:string;
    phone: string;
    image: string;
    acronym: string;
    deliveryData : DeliveryDTO[];
    categoryId: string;
    address:string;
    geolocation: LocationDTO;
}

export interface DeliveryDTO {
    days: string;
    schedule: string;
}

export interface LocationDTO {
    lat: number;
    lng: number;
}