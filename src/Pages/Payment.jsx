import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import html2canvas from "html2canvas";
import confetti from "canvas-confetti";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import "../styles/Payment.css";
import tune from "../assets/success.mp3"

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#333",
      "::placeholder": { color: "#aaa" },
      fontFamily: "Montserrat, sans-serif",
    },
    invalid: {
      color: "#e63946",
    },
  },
};

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [cartItems, setCartItems] = useState([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [shippingAddress, setShippingAddress] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const shipping = JSON.parse(localStorage.getItem("shippingInfo"));
    setCartItems(storedCart);
    setShippingAddress(shipping);
    if (shipping?.email) setEmail(shipping.email);
  }, []);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePay = async () => {
    if (!stripe || !elements) return;

    if (!email || !name) {
      Swal.fire("❌ Missing Fields", "Please enter your name to continue.", "warning");
      return;
    }

    try {
      const res = await fetch("https://dexter-leather-h288.onrender.com/api/payment/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total * 100,
          userEmail: email,
          shippingInfo: shippingAddress,
          cartItems,
        }),
      });

      const { clientSecret } = await res.json();

      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: { name, email },
        },
      });

      if (error) {
        Swal.fire("❌ Payment Failed", error.message, "error");
      } else if (paymentIntent.status === "succeeded") {
        const orderData = {
          email,
          name,
          cartItems,
          shippingInfo: shippingAddress,
          transactionId: paymentIntent.id,
          amount: total,
          createdAt: new Date().toISOString(),
        };

        await fetch("https://dexter-e4919-default-rtdb.firebaseio.com/order.json", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        const audio = new Audio(tune); // add your custom sound in public folder
        audio.play();

        setPaymentDetails({
          ref: paymentIntent.id,
          time: new Date().toLocaleString(),
          method: "Card Payment",
          sender: name || "N/A",
          amount: total.toLocaleString("en-GB", { style: "currency", currency: "GBP" }),
        });

        setShowReceipt(true);
        localStorage.removeItem("cart");
        localStorage.removeItem("shippingInfo");
      }
    } catch (err) {
      console.error("Payment Error:", err);
      Swal.fire("❌ Error", "Something went wrong.", "error");
    }
  };

  const downloadReceipt = () => {
    const receipt = document.getElementById("receipt");
    if (receipt) {
      html2canvas(receipt).then((canvas) => {
        const link = document.createElement("a");
        link.download = "receipt.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }
  };

  const shareReceipt = async () => {
    const receipt = document.getElementById("receipt");
    if (receipt && navigator.canShare) {
      const canvas = await html2canvas(receipt);
      canvas.toBlob(async (blob) => {
        const file = new File([blob], "receipt.png", { type: "image/png" });
        try {
          await navigator.share({ files: [file], title: "Payment Receipt" });
        } catch (err) {
          console.error("Sharing failed", err);
        }
      });
    } else {
      alert("Sharing not supported on this browser.");
    }
  };

  useEffect(() => {
    if (showReceipt) {
      const canvas = document.getElementById("confetti-canvas");
      if (canvas) {
        const myConfetti = confetti.create(canvas, { resize: true, useWorker: true });
        myConfetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.3 },
        });
      }
    }
  }, [showReceipt]);

  return (
    <div className="container py-5 animate__animated animate__fadeIn payment-page-container">
      <h2 className="text-center mb-4 payment-heading">💳 Secure Checkout</h2>
      <div className="row">
        {/* LEFT */}
        <div className="col-md-6 border-end pe-4">
          <h4 className="fw-bold mb-3">🧾 Your Order</h4>
          <h5 className="text-success">Total: £{total.toFixed(2)}</h5>

          {cartItems.length === 0 ? (
            <p className="text-muted">Your cart is empty.</p>
          ) : (
            cartItems.map((item, i) => (
              <div key={i} className="d-flex align-items-center justify-content-between my-3">
                <div className="d-flex align-items-center">
                  <img src={item.mainImage} alt={item.name} className="order-img me-3" />
                  <div>
                    <div>{item.name}</div>
                    <div className="text-muted">Qty: {item.quantity}</div>
                  </div>
                </div>
                <div>£{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))
          )}

          <hr />
          <h5 className="fw-bold mt-4 mb-3">📦 Shipping Email</h5>
          {shippingAddress ? (
            <div className="shipping-box px-3 py-2 rounded">
              <p><strong>Name:</strong> {shippingAddress.firstName} {shippingAddress.lastName}</p>
              <p><strong>Email:</strong> {shippingAddress.email}</p>
              <p><strong>City:</strong> {shippingAddress.city}</p>
              <p><strong>State:</strong> {shippingAddress.state}</p>
            </div>
          ) : (
            <p className="text-danger">No shipping info found.</p>
          )}
        </div>

        {/* RIGHT */}
        <div className="col-md-6 ps-4">
          <h4 className="fw-bold mb-3">🔐 Payment Info</h4>

          <div className="mb-3">
            <label>Email</label>
            <input type="email" className="form-control" readOnly value={email} />
          </div>

          <div className="mb-3">
            <label>Name on Card</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div className="mb-3">
            <label>Card Number</label>
            <div className="form-control card-input"><CardNumberElement options={CARD_ELEMENT_OPTIONS} /></div>
          </div>

          <div className="row">
            <div className="col-6 mb-3">
              <label>Expiry</label>
              <div className="form-control card-input"><CardExpiryElement options={CARD_ELEMENT_OPTIONS} /></div>
            </div>
            <div className="col-6 mb-3">
              <label>CVC</label>
              <div className="form-control card-input"><CardCvcElement options={CARD_ELEMENT_OPTIONS} /></div>
            </div>
          </div>

          <button className="btn btn-dark w-100 mt-3 pay-btn" onClick={handlePay}>
            Pay £{total.toFixed(2)}
          </button>
        </div>
      </div>

      {/* ✅ Receipt Modal with Confetti */}
      <Modal show={showReceipt} centered onHide={() => setShowReceipt(false)} animation={true}>
        <div
          id="receipt"
          className="position-relative receipt-container p-4 text-center bg-white text-dark rounded animate__animated animate__fadeInUp"
        >
          <canvas
            id="confetti-canvas"
            className="position-absolute top-0 start-0 w-100 h-100 bg-light"
            style={{ pointerEvents: "none", zIndex: 2 }}
          />

          <div style={{ position: "relative", zIndex: 3 }}>
            <div
              className="tick-circle bg-success d-flex justify-content-center align-items-center mx-auto mb-3 animate__animated animate__zoomIn"
            >
              <i className="fa fa-check fa-3x text-white animate__animated animate__bounceIn"></i>
            </div>

            <h3 className="fw-bold text-success animate__animated animate__fadeInDown">Payment Success!</h3>
            <p className="text-muted">Your payment has been completed successfully.</p>

            <h2 className="text-dark fw-bold">{paymentDetails?.amount}</h2>

            <div className="text-start px-4 fw-medium" style={{ fontSize: "0.95rem" }}>
              <p><strong>Ref Number:</strong> {paymentDetails?.ref}</p>
              <p><strong>Payment Time:</strong> {paymentDetails?.time}</p>
              <p><strong>Payment Method:</strong> {paymentDetails?.method}</p>
              <p><strong>Sender Name:</strong> {paymentDetails?.sender}</p>
            </div>

            <div className="d-flex justify-content-center gap-3 mt-4">
              <button className="btn btn-outline-secondary" onClick={downloadReceipt}>
                📥 Download
              </button>
              <button className="btn btn-outline-primary" onClick={shareReceipt}>
                📤 Share
              </button>
              <button className="btn btn-outline-dark" onClick={() => setShowReceipt(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Payment;
