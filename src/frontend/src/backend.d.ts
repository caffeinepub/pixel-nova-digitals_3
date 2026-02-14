import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface NewOrder {
    id: bigint;
    service: string;
    owner?: Principal;
    whatsapp: string;
    fullName: string;
    description: string;
    deliveryTime: string;
    fileUpload: Uint8Array;
    email: string;
    timestamp: bigint;
    budget: string;
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
    adminLogin(email: string, password: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminLogout(token: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrder(service: string, fullName: string, email: string, whatsapp: string, description: string, fileUpload: Uint8Array, budget: string, deliveryTime: string): Promise<bigint>;
    deleteOrderWithToken(token: string, id: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    downloadFileWithToken(token: string, orderId: bigint): Promise<{
        __kind__: "ok";
        ok: Uint8Array;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getAllOrders(): Promise<Array<NewOrder>>;
    getAllOrdersWithToken(token: string): Promise<{
        __kind__: "ok";
        ok: Array<NewOrder>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getOrder(id: bigint): Promise<NewOrder>;
    getOrderDetailWithToken(token: string, id: bigint): Promise<{
        __kind__: "ok";
        ok: NewOrder;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
