import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import "./paymentMethod.css";

const Payment = () => {
  const { state } = useLocation();
  const orderDetails = state?.orderDetails || {};

  const [selectedMethod, setSelectedMethod] = useState("creditCard");
  const stripe = useStripe();
  const elements = useElements();

  const handleMethodChange = (event) => {
    setSelectedMethod(event.target.value);
  };

  const handlePayment = async (event) => {
    event.preventDefault();

    // ✅ COD CASE
    if (selectedMethod === "cash on delivery") {
      alert("Order placed with Cash on Delivery!");
      return;
    }

    if (!stripe || !elements) {
      alert("Stripe not loaded");
      return;
    }

    try {
      // 🔥 Step 1: Create PaymentIntent
      const res = await fetch(
        "https://fooddeliverybackend-t1pl.onrender.com/api/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: orderDetails.totalAmount,
          }),
        }
      );

      const data = await res.json();

      // 🚨 CHECK RESPONSE
      if (!res.ok || !data.clientSecret) {
        console.error("Backend error:", data);
        alert(data.message || "Failed to create payment intent");
        return;
      }

      const clientSecret = data.clientSecret;

      // 🔥 Step 2: Get Card Element
      const cardElement = elements.getElement(CardElement);

      // 🔥 Step 3: Confirm Payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${orderDetails.firstName} ${orderDetails.lastName}`,
            email: orderDetails.email,
          },
        },
      });

      if (result.error) {
        alert("Payment failed: " + result.error.message);
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        alert("Payment successful and order confirmed!");
      } else {
        alert("Payment not completed");
      }

    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="payment-page-container">
      <div className="order-summary-container">
        <h4 className="mb-4">Order Summary</h4>
        <p><b>Total:</b> ${orderDetails.totalAmount}</p>
      </div>

      <div className="payment-method-container">
        <h4 className="mb-4">Choose Your Payment Method</h4>

        <div className="payment-options">
          <label className={`payment-option ${selectedMethod === "creditCard" ? "selected" : ""}`}>
            <input
              type="radio"
              value="creditCard"
              checked={selectedMethod === "creditCard"}
              onChange={handleMethodChange}
            />
            Credit Card / Google Pay
          </label>

          <label className={`payment-option ${selectedMethod === "cash on delivery" ? "selected" : ""}`}>
            <input
              type="radio"
              value="cash on delivery"
              checked={selectedMethod === "cash on delivery"}
              onChange={handleMethodChange}
            />
            Cash on Delivery
          </label>
        </div>

        {/* Stripe Payment */}
        {selectedMethod === "creditCard" && (
          <form onSubmit={handlePayment}>
            <div className="payment-form">
              <label>Card Details</label>
              <div className="form-control">
                <CardElement />
              </div>

              <button type="submit" className="btn btn-primary">
                Confirm Order
              </button>
            </div>
          </form>
        )}

        {/* COD */}
        {selectedMethod === "cash on delivery" && (
          <button className="btn btn-success" onClick={handlePayment}>
            Confirm Order
          </button>
        )}
      </div>
    </div>
  );
};

export default Payment;