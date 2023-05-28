import { InfoUser } from './info';
export interface User {

    username: string;
    email:string;

    ci: string;
    phone: number;

    bussinesId: string;
    password: string;
}

export interface UserSupplier {
    username: string;
    email:string;

    ci: string;
    phone: number;

    supplierId: string;
    password: string; 
}