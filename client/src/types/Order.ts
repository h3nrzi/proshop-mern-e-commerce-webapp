import Product from "./Product";

export interface PaymentResult {
  email_address?: string;
  id?: string;
  payer?: {
    email_address?: string;
    payer_id?: string;
    name?: {
      prefix?: string;
      given_name?: string;
      surname?: string;
      middle_name?: string;
      suffix?: string;
      alternate_full_name?: string;
      full_name?: string;
    };
  };
  status?: string;
  update_time?: string;
}

interface ShippingAddress {
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

interface User {
  _id: string;
  email: string;
  name: string;
}

interface OrderItem {
  _id: string;
  image: string;
  name: string;
  price: number;
  product: Product | string;
  qty: number;
}

export default interface Order {
  _id: string;
  createdAt: string;
  deliveredAt?: string;
  isDelivered: boolean;
  isPaid: boolean;
  itemsPrice: number;
  orderItems: OrderItem[];
  paidAt?: string;
  paymentMethod: string;
  paymentResult?: PaymentResult;
  shippingAddress: ShippingAddress;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  updatedAt: string;
  user: User;
}
