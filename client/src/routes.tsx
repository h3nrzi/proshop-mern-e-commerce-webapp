import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import AppLayout from "./layout/AppLayout";
import PrivateLayout from "./layout/PrivateLayout";
import CartPage from "./pages/CartPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import OrderPage from "./pages/OrderPage";
import PaymentPage from "./pages/PaymentPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import ProductPage from "./pages/ProductPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import ShippingPage from "./pages/ShippingPage";
import OrderListPage from "./pages/admin/OrderListPage";
import ProductEditPage from "./pages/admin/ProductEditPage";
import ProductListPage from "./pages/admin/ProductListPage";
import ProductNewPage from "./pages/admin/ProductNewPage";
import UserEditPage from "./pages/admin/UserEditPage";
import UserListPage from "./pages/admin/UserListPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "product/:id", element: <ProductPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "login", element: <LoginPage /> },

      {
        path: "",
        element: <PrivateLayout />,
        children: [
          { path: "shipping", element: <ShippingPage /> },
          { path: "payment", element: <PaymentPage /> },
          { path: "placeorder", element: <PlaceOrderPage /> },
          { path: "order/:id", element: <OrderPage /> },
          { path: "/profile", element: <ProfilePage /> },

          {
            path: "admin",
            element: <AdminLayout />,
            children: [
              { path: "order-list", element: <OrderListPage /> },
              { path: "product-list", element: <ProductListPage /> },
              { path: "product/new", element: <ProductNewPage /> },
              { path: "product/:id/edit", element: <ProductEditPage /> },
              { path: "user-list", element: <UserListPage /> },
              { path: "user/:id/edit", element: <UserEditPage /> },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
