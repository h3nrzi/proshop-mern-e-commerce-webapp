import apiSlice from "../store/api-slice";
import Cart from "../types/Cart";
import Order from "../types/Order";
import { ORDER_URL, PAYPAL_URL } from "../utils/constants";

interface Req {
  GetOrder: { orderId?: string };
  CreateOrder: Cart;
  UpdateOrderToPaid: { orderId?: string; details: any };
  UpdateOrderToDeliver: { orderId?: string };
}

interface Res {
  GetAllOrders: Order[];
  GetOrder: Order;
  GetPayPalClientId: { clientId: string };
  GetMyOrders: Order[];
  CreateOrder: Order;
  UpdateOrderToPaid: Order;
  UpdateOrderToDeliver: Order;
}

const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Queries

    getAllOrders: builder.query<Res["GetAllOrders"], void>({
      query: () => ({ url: ORDER_URL }),
      providesTags: ["Orders"],
    }),

    getOrder: builder.query<Res["GetOrder"], Req["GetOrder"]>({
      query: ({ orderId }) => ({ url: `${ORDER_URL}/${orderId}` }),
      providesTags: (_result, _error, { orderId }) => [{ type: "Orders", id: orderId }],
    }),

    getMyOrders: builder.query<Res["GetMyOrders"], void>({
      query: () => ({ url: `${ORDER_URL}/myorders` }),
      providesTags: ["MyOrders"],
    }),

    getPayPalClientId: builder.query<Res["GetPayPalClientId"], void>({
      query: () => ({ url: PAYPAL_URL }),
    }),

    // Mutations

    createOrder: builder.mutation<Res["CreateOrder"], Req["CreateOrder"]>({
      query: (data) => ({
        url: ORDER_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Orders", "MyOrders"],
    }),

    updateOrderToPaid: builder.mutation<Res["UpdateOrderToPaid"], Req["UpdateOrderToPaid"]>({
      query: ({ orderId, details }) => ({
        url: `${ORDER_URL}/${orderId}/pay`,
        method: "PATCH",
        body: details,
      }),
      invalidatesTags: (_res, _err, { orderId }) => [
        "Orders",
        "MyOrders",
        { type: "Orders", id: orderId },
      ],
    }),

    updateOrderToDeliver: builder.mutation<
      Res["UpdateOrderToDeliver"],
      Req["UpdateOrderToDeliver"]
    >({
      query: ({ orderId }) => ({
        url: `${ORDER_URL}/${orderId}/deliver`,
        method: "PATCH",
      }),
      invalidatesTags: (_res, _err, { orderId }) => [
        "Orders",
        "MyOrders",
        { type: "Orders", id: orderId },
      ],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetOrderQuery,
  useGetMyOrdersQuery,
  useCreateOrderMutation,
  useGetPayPalClientIdQuery,
  useUpdateOrderToPaidMutation,
  useUpdateOrderToDeliverMutation,
} = orderApi;
