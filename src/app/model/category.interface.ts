import { InfoUser } from "./info";

export interface Category {
    id?: string;
    name: string;
    image?: any;
    deleted:boolean;
    created:InfoUser;
    updated:InfoUser[];
    suppliers: string[];
}