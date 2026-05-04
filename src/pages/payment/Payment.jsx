import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./paymentMethod.css";

const Payment = () => {
  const { state } = useLocation();
  const orderDetails = state?.orderDetails || {};
  const [selectedMethod, setSelectedMethod] = useState("creditCard");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const handleMethodChange = (event) => {
    setSelectedMethod(event.target.value);
  };

  const handleCardNumberChange = (event) => {
    let value = event.target.value.replace(/\D/g, "");
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    if (value.length <= 19) {
      setCardNumber(value);
    }
  };

  const handleCvvChange = (event) => {
    const value = event.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const handleExpiryDateChange = (event) => {
    let value = event.target.value.replace(/\D/g, "");

    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }

    if (value.length <= 5) {
      setExpiryDate(value);
    }
  };

  const handlePayment = async (event) => {
    event.preventDefault(); 
  
    const paymentData = {
      paymentMethod: selectedMethod,
      cardNumber: cardNumber.replace(/\s/g, ''), 
      expiryDate: expiryDate,
      cvv: cvv,
      orderDetails: {
        subtotal: orderDetails.subtotal,
        deliveryFee: orderDetails.deliveryFee,
        totalAmount: orderDetails.totalAmount,
        firstName: orderDetails.firstName,
        lastName: orderDetails.lastName,
        email: orderDetails.email,
        street: orderDetails.street,
        city: orderDetails.city,
        state: orderDetails.state,
        zipCode: orderDetails.zipCode,
        country: orderDetails.country,
        phone: orderDetails.phone
      }
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/orders/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });
  
      const result = await response.json();
  
      if (result.success) {
        alert('Payment successful and order confirmed!');
      } else {
        alert('Payment failed: ' + result.message);
      }
    } catch (error) {
      alert('Error processing payment: ' + error.message);
    }
  };
  

  return (
    <div className="payment-page-container">
      <div className="order-summary-container">
        <h4 className="mb-4">Order Summary</h4>
        <div className="order-summary-details">
          <p><b>Subtotal:</b> ${orderDetails.subtotal}</p>
          <p><b>Delivery Fee:</b> ${orderDetails.deliveryFee}</p>
          <hr />
          <p><b>Total Amount:</b> <b>${orderDetails.totalAmount}</b></p>
        </div>

        <h4 className="mb-4">User Information</h4>
        <div className="user-information-details">
          <p><b>Name:</b> {orderDetails.firstName} {orderDetails.lastName}</p>
          <p><b>Email:</b> {orderDetails.email}</p>
          <p><b>Address:</b> {orderDetails.street}, {orderDetails.city}, {orderDetails.state}, {orderDetails.zipCode}, {orderDetails.country}</p>
          <p><b>Phone:</b> {orderDetails.phone}</p>
        </div>
      </div>

      <div className="payment-method-container">
        <h4 className="mb-4">Choose Your Payment Method</h4>

        <div className="payment-options">
          <label className={`payment-option ${selectedMethod === 'creditCard' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="creditCard"
              checked={selectedMethod === 'creditCard'}
              onChange={handleMethodChange}
            />
            Credit Card
          </label>

          <label className={`payment-option ${selectedMethod === 'cash on delivery' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="cash on delivery"
              checked={selectedMethod === 'cash on delivery'}
              onChange={handleMethodChange}
            />
            Cash on Delivery
          </label>
        </div>

        {selectedMethod === 'creditCard' && (
          <form onSubmit={handlePayment}>
            <div className="payment-form credit-card-form animate__animated animate__fadeIn">
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength="19"
                  required
                />
              </div>
              <div className="form-group">
                <label>Expiration Date</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                  maxLength="5"
                  required
                />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="123"
                  value={cvv}
                  onChange={handleCvvChange}
                  maxLength="4"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Confirm Order</button>
            </div>
          </form>
        )}

        {selectedMethod === 'cash on delivery' && (
          <div className="payment-form other-form animate__animated animate__fadeIn">
            <button className="btn btn-success" onClick={handlePayment}>Confirm Order</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
