import apiSlice from "../store/api-slice";
import { UserInfo } from "../types/Auth";
import { USERS_URL } from "../utils/constants";

interface Req {
  GetAll: void;
  GetOne: { userId?: string };
  Update: { userId?: string; data: UserInfo };
  Delete: { userId?: string };
  Register: { name: string; email: string; password: string };
  Login: { email: string; password: string };
  UpdateProfile: { name: string; email: string; password: string };
}

interface Res {
  GetAll: UserInfo[];
  GetOne: UserInfo;
  Update: UserInfo;
  Delete: { message: string };
  Login: UserInfo;
  Register: UserInfo;
  Logout: { message: string };
  UpdateProfile: UserInfo;
}

const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Queries
    getAllUser: builder.query<Res["GetAll"], Req["GetAll"]>({
      query: () => ({ url: USERS_URL }),
      providesTags: ["Users"],
    }),

    getUser: builder.query<Res["GetOne"], Req["GetOne"]>({
      query: ({ userId }) => ({ url: `${USERS_URL}/${userId}` }),
    }),

    // Mutations
    register: builder.mutation<Res["Register"], Req["Register"]>({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation<Res["Login"], Req["Login"]>({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation<Res["Logout"], void>({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),

    updateProfile: builder.mutation<Res["UpdateProfile"], Req["UpdateProfile"]>({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PATCH",
        body: data,
      }),
    }),

    deleteUser: builder.mutation<Res["Delete"], Req["Delete"]>({
      query: ({ userId }) => ({
        url: `${USERS_URL}/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users", "Orders", "MyOrders"],
    }),

    updateUser: builder.mutation<Res["Update"], Req["Update"]>({
      query: ({ userId, data }) => ({
        url: `${USERS_URL}/${userId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetAllUserQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
} = usersApi;
