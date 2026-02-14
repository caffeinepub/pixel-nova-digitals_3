import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: bigint;
    files: Array<FileData>;
    name: string;
    description: string;
    price: bigint;
}
export interface AppContent {
    metaDescription: string;
    tiktok: string;
    metaKeywords: string;
    mail: string;
    whatsapp: string;
    description: string;
    facebook: string;
    address: string;
    titleTag: string;
    telegram: string;
}
export type AdminAuthResult = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: string;
};
export interface OrderedProduct {
    productId: bigint;
    quantity: bigint;
}
export interface FileData {
    fileData: string;
    fileName: string;
    fileType: string;
}
export interface ContactInfo {
    email: string;
    address: string;
    phone: string;
}
export interface Order {
    id: bigint;
    total: bigint;
    userId: Principal;
    isPaid: boolean;
    products: Array<OrderedProduct>;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(name: string, price: bigint, description: string, files: Array<FileData>): Promise<Product>;
    adminExists(): Promise<boolean>;
    adminLogin(email: string, password: string): Promise<AdminAuthResult>;
    adminLogout(token: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createDefaultAdmin(): Promise<boolean>;
    createOrder(orderedProducts: Array<OrderedProduct>): Promise<Order>;
    deleteOrderWithToken(_token: string, orderId: bigint): Promise<void>;
    downloadFileWithToken(_token: string, productId: bigint): Promise<FileData>;
    getAllOrdersWithToken(_token: string): Promise<Array<Order>>;
    getAppContent(): Promise<AppContent>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactInfo(): Promise<ContactInfo>;
    getMyOrders(): Promise<Array<Order>>;
    getOrderDetailWithToken(_token: string, orderId: bigint): Promise<Order>;
    getProducts(): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateAppContent(newAppContent: AppContent): Promise<void>;
    updateContactInfo(newContactInfo: ContactInfo): Promise<void>;
}
