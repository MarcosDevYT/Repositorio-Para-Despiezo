export interface ParcelStatus {
  id: number;
  message: string;
}

export interface ParcelDocument {
  type: string;
  size: string;
  link: string;
}

export interface ParcelAddressDivided {
  street: string;
  house_number: string;
}

export interface ParcelShipment {
  id: number;
  name: string;
}

export interface ParcelLabel {
  normal_printer: string[];
  label_printer: string;
}

export interface ParcelCountry {
  iso_2: string;
  iso_3: string;
  name: string;
}

export interface ParcelCarrier {
  code: string;
}

export interface Parcel {
  id: number;
  reference: string;
  status: ParcelStatus;
  tracking_number: string;
  weight: string;
  order_number: string;
  total_insured_value: number;
  parcel_items: any[]; // Si tenés tipado para items, reemplazar any
  documents: ParcelDocument[];
  external_reference: string | null;
  is_return: boolean;
  note: string;
  total_order_value: string;
  total_order_value_currency: string;
  length: number | null;
  width: number | null;
  height: number | null;
  contract: string | null;
  address_divided: ParcelAddressDivided;
  shipment: ParcelShipment;
  shipping_method: number;
  shipping_method_checkout_name: string;
  insured_value: number;
  shipment_uuid: string | null;
  data: Record<string, any>;
  type: string;
  external_order_id: string;
  external_shipment_id: string;
  colli_uuid: string;
  collo_nr: number;
  collo_count: number;
  label: ParcelLabel;
  customs_declaration: Record<string, any>;
  to_state: string | null;
  date_created: string;
  date_announced: string;
  date_updated: string;
  customs_information: string | null;
  awb_tracking_number: string | null;
  box_number: string | null;
  customs_invoice_nr: string;
  customs_shipment_type: string | null;
  address: string;
  address_2: string;
  city: string;
  company_name: string;
  country: ParcelCountry;
  email: string;
  name: string;
  postal_code: string;
  telephone: string;
  to_post_number: string;
  to_service_point: string | null;
  errors: Record<string, any>;
  carrier: ParcelCarrier;
  tracking_url: string;
}

export interface SendcloudResponse {
  parcel: Parcel;
}
