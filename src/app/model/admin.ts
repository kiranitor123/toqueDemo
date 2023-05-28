import { InfoUser } from "./info";

export class Admin {
  id:string;
  username:string;
  email:string;
  deleted:boolean;
  bussinesConfig:any[];
  SuppliersConfig:any[];
  created:InfoUser;
  updated:InfoUser[];

  constructor(obj?:any) {
    this.id = obj.id;
    this.username = obj.username;
    this.email = obj.email;
    this.deleted = obj.deleted;
    this.bussinesConfig = obj.bussinesConfig;
    this.SuppliersConfig = obj.SuppliersConfig;
    this.created = obj.created;
    this.updated = obj.updated;
  }
}