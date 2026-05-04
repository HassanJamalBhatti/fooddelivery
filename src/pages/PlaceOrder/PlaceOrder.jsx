import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./PlaceOrder.css";
import { useNavigate } from "react-router-dom";

// Assuming deliveryFee is a constant value
const deliveryFee = 5; // Replace with the actual delivery fee logic if different

const PlaceOrder = () => {
  const { getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();

  // State to capture user information
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const orderDetails = {
      ...userInfo, // Include user information in the order details
      subtotal: getTotalCartAmount(),
      deliveryFee: getTotalCartAmount() === 0 ? 0 : deliveryFee,
      totalAmount: getTotalCartAmount() + (getTotalCartAmount() === 0 ? 0 : deliveryFee),
    };

    // Navigate to the payment page with order details
    navigate("/payment", { state: { orderDetails } });
  };

  return (
    <>
      <button className="GoBack" onClick={() => navigate("/cart")}>
        ⬅️Go Back to Cart Page
      </button>

      <form className="place-order" onSubmit={handleSubmit}>
        <div className="place-order-left">
          <h2 className="title">Delivery Information</h2>
          <div className="multi-fields">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={userInfo.firstName}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={userInfo.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={userInfo.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="street"
            placeholder="Street"
            value={userInfo.street}
            onChange={handleInputChange}
            required
          />
          <div className="multi-fields">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={userInfo.city}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={userInfo.state}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="multi-fields">
            <input
              type="number"
              name="zipCode"
              placeholder="Zip Code"
              value={userInfo.zipCode}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={userInfo.country}
              onChange={handleInputChange}
              required
            />
          </div>
          <input
            type="number"
            name="phone"
            placeholder="Phone"
            value={userInfo.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="place-order-right">
          <div className="cart-total">
            <h2 className="title">Cart Total</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>${getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>${getTotalCartAmount() === 0 ? 0 : deliveryFee}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>
                  ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + deliveryFee}
                </b>
              </div>
            </div>
            <button type="submit">PROCEED TO PAYMENT</button>
          </div>
        </div>
      </form>
    </>
  );
};

export default PlaceOrder;
