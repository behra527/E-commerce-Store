import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Swal from "sweetalert2";
import "../styles/Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    const sanitized = stored.map((item) => ({
      ...item,
      quantity: item.quantity && item.quantity > 0 ? item.quantity : 1,
      price: item.price ?? 0,
      name: item.name ?? "Untitled",
      mainImage: item.mainImage ?? "https://via.placeholder.com/150",
    }));
    setCartItems(sanitized);
  }, []);

  // Update quantity
  const updateQuantity = (index, amount) => {
    setCartItems((prevItems) => {
      const updated = [...prevItems];
      const item = { ...updated[index] };
      const newQty = item.quantity + amount;
      if (newQty < 1) return prevItems;
      item.quantity = newQty;
      updated[index] = item;
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  // Remove item
  const deleteItem = (index) => {
    const updated = cartItems.filter((_, i) => i !== index);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    Swal.fire("Removed", "Item removed from cart.", "success");
  };

  // Navigate to product catalogue
  const handleContinueShopping = () => navigate("/catalogue");

  // Checkout handler
  const handleCheckout = () => {
  if (cartItems.length === 0) {
    Swal.fire("Cart Empty", "Please add items before checkout.", "warning");
    return;
  }

  // Optional: Save current cart for shipping page
  localStorage.setItem("checkoutItems", JSON.stringify(cartItems));

  // Navigate to shipping
  navigate("/shipping");
};


  // Calculate total
  const total = cartItems.reduce(
    (acc, item) => acc + (item.price ?? 0) * (item.quantity ?? 1),
    0
  );

  return (
    <div className="cart-container">
      <h2 className="cart-title">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-muted">Your cart is empty. 🛍️</p>
      ) : (
        cartItems.map((item, index) => (
          <div className="cart-item" key={item.id || index}>
            <div className="cart-product-info">
              <img
                src={item.mainImage}
                alt={item.name}
                className="product-image"
              />
              <div className="product-details">
                <p className="product-name">{item.name}</p>
                <p className="product-price">
                  {(item.price ?? 0).toLocaleString("en-GB", {
                    style: "currency",
                    currency: "GBP",
                  })}
                </p>
                {item.color && <p className="product-color">Color: {item.color}</p>}
              </div>
            </div>

            <div className="cart-quantity">
              <button
                className="qty-btn"
                onClick={() => updateQuantity(index, -1)}
                disabled={item.quantity === 1}
              >
                <RemoveIcon fontSize="small" />
              </button>
              <span className="qty-value">{item.quantity}</span>
              <button
                className="qty-btn"
                onClick={() => updateQuantity(index, 1)}
              >
                <AddIcon fontSize="small" />
              </button>
              <button className="delete-btn" onClick={() => deleteItem(index)}>
                <DeleteIcon />
              </button>
            </div>

            <div className="cart-total">
              <p>
                {((item.price ?? 0) * item.quantity).toLocaleString("en-GB", {
                  style: "currency",
                  currency: "GBP",
                })}
              </p>
            </div>
          </div>
        ))
      )}

      {cartItems.length > 0 && (
        <div className="cart-footer">
          <div className="total-section">
            <span>Estimated total</span>
            <strong>
              {total.toLocaleString("en-GB", {
                style: "currency",
                currency: "GBP",
              })}
            </strong>
          </div>
          <p className="checkout-note">
            Taxes, discounts and shipping calculated at checkout.
          </p>
          <button className="checkout-btn" onClick={handleCheckout}>
            Check out
          </button>
          <button className="continue-shopping" onClick={handleContinueShopping}>
            Continue shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
