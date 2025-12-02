import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/constants";

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });

const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Products", "Orders", "MyOrders", "Users"] as const,
  endpoints: () => ({}),
  refetchOnFocus: false, // Refetch data when the window regains focus
  refetchOnReconnect: false, // Refetch data when the network connection is reestablished
  refetchOnMountOrArgChange: 0, // Refetch data every 0 seconds when component mounts or args change
  keepUnusedDataFor: 90, // Keep unused data in the cache for 90 seconds
});

export default apiSlice;
