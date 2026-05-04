import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import StoreContextProvider from "./context/StoreContext.jsx";

// ✅ Stripe imports
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// ✅ Stripe public key
const stripePromise = loadStripe("YOUR_PUBLISHABLE_KEY");

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StoreContextProvider>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </StoreContextProvider>
  </BrowserRouter>
);