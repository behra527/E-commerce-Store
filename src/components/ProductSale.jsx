// src/pages/ProductSale.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ZoomIn, Close, Add, Remove } from "@mui/icons-material";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "../styles/ProductSale.css"; 
import img from "../assets/watch.jpg"; // Adjust the path as needed

const product = {
  title: "Audemars Piguet Royal Oak",
  priceOriginal: 5250,
  priceSale: 3850,
  image: img,
  colors: [
    { label: "Silver Black", disabled: true },
    { label: "All-Black", disabled: false },
    { label: "Black White", disabled: true },
    { label: "Black Grey", disabled: true },
    { label: "Silver White", disabled: false },
  ],
};

const ProductSale = () => {
  const [selectedColor, setSelectedColor] = "All-Black";
  const [quantity, setQuantity] = useState(1);
  const [showZoom, setShowZoom] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    const item = {
      title: product.title,
      price: product.priceSale,
      color: selectedColor,
      quantity,
      image: img,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    existingCart.push(item);
    localStorage.setItem("cart", JSON.stringify(existingCart));
    alert("Item added to cart!");
  };

  const handleBuyNow = () => {
    const item = {
      title: product.title,
      price: product.priceSale,
      color: selectedColor,
      quantity,
      image: product.image,
    };
    navigate("/payment", { state: { item } });
  };

  return (
    <div className="container py-5">
      <div className="row">
        {/* Image section */}
        <div className="col-md-6">
          <div className="position-relative product-image-container">
            <img
              src={product.image}
              alt="product"
              className="img-fluid rounded shadow"
            />
            <div className="zoom-icon-wrapper" onClick={() => setShowZoom(true)}>
              <ZoomIn className="zoom-icon" />
            </div>
          </div>
        </div>

        {/* Info section */}
        <div className="col-md-6">
          <p className="text-uppercase text-muted small">Featured Product</p>
          <h2 className="fw-bold">{product.title}</h2>
          <p>
            <del className="text-muted me-2">Rs.{product.priceOriginal.toLocaleString()} PKR</del>
            <span className="fw-bold">Rs.{product.priceSale.toLocaleString()} PKR</span>
            <span className="badge bg-dark ms-2">Sale</span>
          </p>

          {/* Colors */}
          <p className="fw-semibold mt-4">Colours</p>
          <div className="d-flex flex-wrap gap-2">
            {product.colors.map((color, idx) => (
              <button
                key={idx}
                disabled={color.disabled}
                onClick={() => setSelectedColor(color.label)}
                className={`btn btn-sm color-btn ${
                  selectedColor === color.label ? "active" : ""
                }`}
              >
                {color.label}
              </button>
            ))}
          </div>

          {/* Quantity */}
          <p className="fw-semibold mt-4">Quantity</p>
          <div className="d-flex align-items-center border quantity-box">
            <Button
              variant="link"
              className="text-dark px-3"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Remove />
            </Button>
            <span>{quantity}</span>
            <Button
              variant="link"
              className="text-dark px-3"
              onClick={() => setQuantity((q) => q + 1)}
            >
              <Add />
            </Button>
          </div>

          {/* Actions */}
          <div className="mt-4">
            <button className="btn btn-outline-dark w-100 mb-2" onClick={handleAddToCart}>
              Add to cart
            </button>
            <button className="btn btn-dark w-100" onClick={handleBuyNow}>
              Buy it now
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Zoom */}
      <Modal show={showZoom} onHide={() => setShowZoom(false)} centered size="lg">
        <Modal.Body className="p-0 position-relative bg-black">
          <Button
            variant="link"
            className="position-absolute top-0 end-0 m-2 text-white"
            onClick={() => setShowZoom(false)}
          >
            <Close fontSize="large" />
          </Button>
          <img src={product.image} alt="zoom" className="w-100 zoomed-image" />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProductSale;
