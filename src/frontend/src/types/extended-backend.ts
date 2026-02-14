// Extended types for backend functionality not yet reflected in generated types
import { ContactInfo as BaseContactInfo } from '@/backend';

export interface ExtendedContactInfo extends BaseContactInfo {
  contactTitle: string;
  contactSubtitle: string;
  shortDescription: string;
  footerContactText: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  whatsappUrl: string;
  googleMapsEmbedUrl: string;
  mapAddressString: string;
  phoneNumber: string;
}

export interface NewOrder {
  id: bigint;
  owner: [] | [string];
  service: string;
  fullName: string;
  email: string;
  whatsapp: string;
  description: string;
  fileUpload: Uint8Array;
  budget: string;
  deliveryTime: string;
  timestamp: bigint;
}

export type Result<T, E> = 
  | { __kind__: 'ok'; ok: T }
  | { __kind__: 'err'; err: E };

// Motoko variant style (alternative format)
export type MotokoVariant<T, E> = 
  | { ok: T }
  | { err: E };

/**
 * Extended backend interface with admin authentication and order management methods.
 * 
 * Admin panel is now publicly accessible - token parameters are ignored by the backend.
 * All admin methods can be called without authentication.
 * 
 * Note: These methods may not exist on all backend versions. Frontend code should
 * defensively check for method existence before calling to avoid runtime errors.
 */
export interface ExtendedBackendInterface {
  adminLogin?(email: string, password: string): Promise<Result<string, string> | MotokoVariant<string, string> | any>;
  adminLogout?(token: string): Promise<void>;
  adminExists?(): Promise<boolean>;
  createDefaultAdmin?(): Promise<boolean>;
  createOrder(
    service: string,
    fullName: string,
    email: string,
    whatsapp: string,
    description: string,
    fileUpload: Uint8Array,
    budget: string,
    deliveryTime: string
  ): Promise<bigint>;
  getAllOrdersWithToken?(token: string): Promise<NewOrder[]>;
  getOrderDetailWithToken?(token: string, orderId: bigint): Promise<NewOrder>;
  downloadFileWithToken?(token: string, orderId: bigint): Promise<any>;
  deleteOrderWithToken?(token: string, orderId: bigint): Promise<void>;
  getContactInfo(): Promise<ExtendedContactInfo>;
  updateContactInfo(newContactInfo: ExtendedContactInfo): Promise<void>;
}
