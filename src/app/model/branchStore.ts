export interface BranchStore {
    uid: string;
    ownerUID: string;
    name: string;
    direction: string;
    references: string;
    phone?: number;
    latitude?: number;
    longitude?: number;
}