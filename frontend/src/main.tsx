import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import store from "./store";
// import "bootstrap/dist/css/bootstrap.min.css";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { HelmetProvider } from "react-helmet-async";
import "./assets/styles/bootstrap.custom.css";
import "./assets/styles/index.css";
import ThemeProvider from "./theme/ThemeProvider";

const paypalOptions = { clientId: "" };

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <Provider store={store}>
          <PayPalScriptProvider deferLoading={true} options={paypalOptions}>
            <RouterProvider router={router} />
          </PayPalScriptProvider>
        </Provider>
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>,
);
