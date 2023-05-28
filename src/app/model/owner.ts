export interface Owner {
    uid?: string;
    userName?: string;
    email: string;
    password: string;
    storeName?: string;
    phone?: number;
    ci?: number;
    imageProfil?: string;
    imageStore?: string;
    role?: string;
    deliveryInCharge?: boolean;
    haveBranchStore: boolean;
    deliveryInchargeName: string;
    deliveryInchargePhone: number;
    branchStore?: string[]
    suppliers?: any
    createdDate?: Date;
    updatedDate?: Date;
    delete?: boolean;
}