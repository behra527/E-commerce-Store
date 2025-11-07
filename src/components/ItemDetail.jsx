import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentIcon from "@mui/icons-material/Payment";
import Swal from "sweetalert2";
import Modal from "react-bootstrap/Modal";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ItemDetail.css";

const ITEM_API = "https://dexter-e4919-default-rtdb.firebaseio.com/item";

function ItemDetail() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [readMore, setReadMore] = useState(false);

  useEffect(() => {
    fetch(`${ITEM_API}/${itemId}.json`)
      .then((res) => res.json())
      .then((data) => {
        setItem(data);
        setSelectedColor(data.colors?.[0] || "");
        setSelectedImage(data.gallery?.[0] || data.mainImage);
      });
  }, [itemId]);

  const handleAddToCart = () => {
    const existing = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItem = {
      ...item,
      quantity,
      color: selectedColor,
      mainImage: selectedImage,
    };
    localStorage.setItem("cart", JSON.stringify([...existing, cartItem]));
    window.dispatchEvent(new Event("cartUpdated"));
    Swal.fire({
      icon: "success",
      title: "Added to Cart",
      text: `"${item.name}" added with quantity ${quantity} and color "${selectedColor}".`,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleOrderNow = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire("Please Login", "You need to be logged in to proceed.", "warning");
      navigate("/login?redirectTo=/shipping");
      return;
    }

    const checkoutItem = {
      ...item,
      quantity,
      color: selectedColor,
      mainImage: selectedImage,
    };

    localStorage.setItem("checkoutItem", JSON.stringify(checkoutItem));
    navigate("/shipping");
  };

  if (!item) return <div className="text-center py-5">Loading...</div>;

  return (
    <motion.div
      className="container py-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="row g-5">
        {/* LEFT: Main Image + Gallery */}
        <div className="col-lg-6">
          <motion.img
            src={selectedImage}
            alt={item.name}
            className="img-fluid rounded shadow-sm mb-3"
            style={{
              height: "350px",
              width: "100%",
              objectFit: "cover",
              cursor: "zoom-in",
              borderRadius: "10px",
            }}
            onClick={() => setShowModal(true)}
            whileHover={{ scale: 1.02 }}
          />

          <div className="d-flex gap-2 flex-wrap mt-2">
            {[item.mainImage, ...(item.gallery || [])].map((img, i) => (
              <motion.img
                key={i}
                src={img}
                alt={`Gallery ${i}`}
                className={`border gallery-thumb rounded ${selectedImage === img ? "selected-thumb" : ""}`}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  cursor: "pointer",
                  border: selectedImage === img ? "2px solid #000" : "1px solid #ccc",
                }}
                onClick={() => setSelectedImage(img)}
                whileHover={{ scale: 1.05 }}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: Details */}
        <div className="col-lg-6">
          <motion.h2 className="fw-bold mb-3 item__name">{item.name}</motion.h2>

          <div className="d-flex align-items-center gap-3 mb-3">
            <h4 className="text-dark fw-bold m-0 item__price">£ {item.price?.toLocaleString()}</h4>
            {item.onSale && (
              <span className="badge bg-dark text-uppercase px-3 py-2">Sale</span>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="fw-semibold d-block mb-2 item__discription">Description:</label>
            <p className="text-muted">
              {item.description?.length > 300 && !readMore ? (
                <>
                  {item.description.slice(0, 300)}...
                  <span
                    className="text-dark fw-semibold"
                    style={{ cursor: "pointer", }}
                    onClick={() => setReadMore(true)}
                  >
                    {" "}Read more
                  </span>
                </>
              ) : (
                item.description
              )}
            </p>
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <label className="fw-semibold item__quantity">Quantity:</label>
            <div className="d-flex align-items-center mt-3">
              <button className="btn btn-outline-dark px-3" onClick={() => setQuantity(q => Math.max(1, q - 1))}>–</button>
              <span className="mx-3 fs-5">{quantity}</span>
              <button className="btn btn-outline-dark px-3" onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
          </div>

          {/* Colors */}
          {item.colors?.length > 0 && (
            <div className="mb-4 item__color">
              <label className="fw-semibold item__color__header">Available Colors:</label>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {item.colors.map((color, index) => (
                  <motion.span
                    key={index}
                    className={`badge py-2 px-3 ${selectedColor === color ? "bg-dark text-white" : "bg-light text-dark"}`}
                    style={{ cursor: "pointer", border: "1px solid #ccc" }}
                    onClick={() => {
                      setSelectedColor(color);
                      const match = item.gallery?.find((img) =>
                        img.toLowerCase().includes(color.toLowerCase())
                      );
                      if (match) setSelectedImage(match);
                    }}
                    whileHover={{ scale: 1.08 }}
                  >
                    {color}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

        {/* Buttons: Styled vertically with proper spacing */}
<div className="item__btn-group">
  <motion.button
    onClick={handleAddToCart}
    className="btn btn-outline-dark btn-lg d-flex justify-content-center align-items-center gap-2 item__btn"
    whileTap={{ scale: 0.96 }}
    whileHover={{ scale: 1.03 }}
  >
    <ShoppingCartIcon /> Add to Cart
  </motion.button>
</div>


        </div>
      </div>

      {/* Image Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Body className="p-0">
          <img
            src={selectedImage}
            alt={item.name}
            className="w-100"
            style={{ maxHeight: "80vh", objectFit: "contain" }}
            onClick={() => setShowModal(false)}
          />
        </Modal.Body>
      </Modal>
    </motion.div>
  );
}

export default ItemDetail;
