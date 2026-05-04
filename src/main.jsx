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
const stripePromise = loadStripe("pk_live_51TTGiyHgw0gfN1LREZFfB6SeXLIlglmuYUczadUPPGaNm10ecQ7pWTiSXwt6irBAN5Fke4dXSES0QpIhdS4vFyvK0065w4i4PF");

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StoreContextProvider>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </StoreContextProvider>
  </BrowserRouter>
);