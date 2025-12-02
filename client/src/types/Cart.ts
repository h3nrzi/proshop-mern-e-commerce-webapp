import Product from "./Product";

export interface ShippingAddress {
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export default interface Cart {
  itemsPrice: number;
  orderItems: Product[];
  paymentMethod?: string;
  shippingAddress?: ShippingAddress;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}
