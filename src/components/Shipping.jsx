import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Shipping.css";
import Swal from "sweetalert2";

const Shipping = () => {
  const [cartItems, setCartItems] = useState([]);
  const [checkoutItem, setCheckoutItem] = useState([]); // Renamed for clarity
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    zip: "",
    description: "",
  });

  const navigate = useNavigate();

  // ✅ FIXED: Added dependency array to run only on mount
  useEffect(() => {
    const storedItem = JSON.parse(localStorage.getItem("checkoutItem")) || [];
    setCheckoutItem(storedItem);
  }, []);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(stored);
  }, []);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = 3;
  const taxes = 2;
  const total = subtotal + shipping + taxes;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContinue = () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.phone ||
      !form.city ||
      !form.state ||
      !form.zip
    ) {
      Swal.fire("Missing Info", "Please fill all required fields", "warning");
      return;
    }

    localStorage.setItem("shippingInfo", JSON.stringify(form));
    navigate("/payment");
  };

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* Left: Shipping Form */}
        <div className="col-lg-8">
          <h4 className="mb-4">Shipping Address</h4>
          <div className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="First Name*"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Last Name*"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <input
                type="email"
                className="form-control"
                placeholder="Email*"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Phone number*"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="City*"
                name="city"
                value={form.city}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="State*"
                name="state"
                value={form.state}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Zip Code*"
                name="zip"
                value={form.zip}
                onChange={handleChange}
              />
            </div>
            <div className="col-12">
              <textarea
                className="form-control"
                rows="3"
                placeholder="Enter a description..."
                name="description"
                value={form.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Right: Cart Summary */}
        <div className="col-lg-4">
          <div className="p-4 border rounded bg-white shadow-sm">
            <h5 className="mb-3">Your Cart</h5>

            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cartItems.map((item, idx) => (
                <div className="d-flex mb-3" key={idx}>
                  <img
                    src={item.mainImage}
                    alt={item.name}
                    width="60"
                    height="60"
                    className="me-3 rounded"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="flex-grow-1">
                    <p className="mb-1 fw-bold">{item.name}</p>
                    <small className="text-muted">
                      {item.color ? `Color: ${item.color}` : ""} | Qty: {item.quantity}
                    </small>
                  </div>
                  <div>
                    <span className="fw-bold">
                      £{(item.price * item.quantity).toLocaleString("en-GB")}
                    </span>
                  </div>
                </div>
              ))
            )}

            <ul className="list-unstyled mt-3">
              <li className="d-flex justify-content-between">
                <span>Subtotal</span>
                <span>£{subtotal.toLocaleString("en-GB")}</span>
              </li>
              <li className="d-flex justify-content-between">
                <span>Shipping</span>
                <span>£{shipping}</span>
              </li>
              <li className="d-flex justify-content-between">
                <span>Estimated taxes</span>
                <span>£{taxes}</span>
              </li>
              <li className="d-flex justify-content-between fw-bold mt-2 border-top pt-2">
                <span>Total</span>
                <span>£{total.toLocaleString("en-GB")}</span>
              </li>
            </ul>

            <button
              className="btn btn-dark w-100 mt-3"
              onClick={handleContinue}
            >
              Continue to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
