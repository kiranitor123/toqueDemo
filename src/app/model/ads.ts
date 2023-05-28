import { StateUser } from "./state";

export interface Ads {
  id:string;
  name: string;
  image: string;
  deleted: boolean;
  status: boolean;
  available: boolean;
  created: StateUser;
  createdAt: any;
  updated: StateUser[];
  updatedAt: any;
}

export interface AdsDTO {
  name: string;
  image: any;
}

export interface AdsUpdateDTO {
  name: string;
  image: any;
  available: boolean;
}

export interface AdsDeleteDTO {
  id:string;
  deleted: boolean;
}