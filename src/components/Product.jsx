import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import "../styles/product.css";

const FIREBASE_URL = "https://dexter-e4919-default-rtdb.firebaseio.com/item.json";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [priceFilter, setPriceFilter] = useState({ min: "", max: "" });
  const [availability, setAvailability] = useState("");
  const [sortBy, setSortBy] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(FIREBASE_URL)
      .then((res) => res.json())
      .then((data) => {
        const parsedProducts = Object.entries(data || {}).map(([id, item]) => ({
          id,
          title: item.name,
          description: item.description,
          image: item.mainImage,
          gallery: item.gallery,
          newPrice: item.price ,
          oldPrice: item.originalPrice ,
          status: item.stock || "in",
          colors: item.colors || [],
        }));
        setProducts(parsedProducts);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        Swal.fire("Error", "Failed to load products.", "error");
      });
  }, []);

  const handleAddToCart = (item) => {
  const existing = JSON.parse(localStorage.getItem("cart")) || [];
  const index = existing.findIndex((i) => i.id === item.id);

  const cartItem = {
    id: item.id,
    name: item.title, // Map title to name
    price: item.newPrice, // Map newPrice to price
    mainImage: item.image, // Map image to mainImage
    quantity: 1,
    color: item.colors?.[0] || "Default", // optional
  };

  if (index !== -1) {
    existing[index].quantity += 1;
  } else {
    existing.push(cartItem);
  }

  localStorage.setItem("cart", JSON.stringify(existing));
  window.dispatchEvent(new Event("cartUpdated"));

  Swal.fire({
    icon: "success",
    title: "Added to Cart",
    text: `"${cartItem.name}" has been added to your cart.`,
    showConfirmButton: false,
    timer: 1500,
  });
};


  const handleSort = (items) => {
    const sorted = [...items];
    switch (sortBy) {
      case "az":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "za":
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case "low-high":
        return sorted.sort((a, b) => a.newPrice - b.newPrice);
      case "high-low":
        return sorted.sort((a, b) => b.newPrice - a.newPrice);
      case "newest":
        return sorted.reverse();
      default:
        return items;
    }
  };

  const filteredProducts = products.filter((item) => {
    const priceOk =
      (!priceFilter.min || item.newPrice >= parseInt(priceFilter.min)) &&
      (!priceFilter.max || item.newPrice <= parseInt(priceFilter.max));
    const availabilityOk = !availability || item.status === availability;
    return priceOk && availabilityOk;
  });

  const finalProducts = handleSort(filteredProducts);

  return (
    <motion.div className="container py-5" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.h2 className="fw-bold mb-4 text-center" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        Explore Our Products
      </motion.h2>

      {/* Filters */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div className="d-flex gap-3 flex-wrap">
          {/* Availability Filter */}
          <div className="dropdown">
            <button className="btn btn-outline-dark dropdown-toggle" data-bs-toggle="dropdown">
              Availability
            </button>
            <ul className="dropdown-menu p-3 shadow">
              {["in", "out"].map((status) => (
                <li className="form-check mt-1" key={status}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="availability"
                    value={status}
                    checked={availability === status}
                    onChange={(e) => setAvailability(e.target.value)}
                  />
                  <label className="form-check-label ms-2">
                    {status === "in" ? "In Stock" : "Out of Stock"}
                  </label>
                </li>
              ))}
              <li>
                <button className="btn btn-sm btn-link text-danger mt-2" onClick={() => setAvailability("")}>
                  Reset
                </button>
              </li>
            </ul>
          </div>

          {/* Price Filter */}
          <div className="dropdown">
            <button className="btn btn-outline-dark dropdown-toggle" data-bs-toggle="dropdown">
              Price
            </button>
            <div className="dropdown-menu p-3 shadow" style={{ minWidth: "250px" }}>
              <p className="mb-2">The highest price is £500</p>
              <div className="d-flex gap-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="From"
                  value={priceFilter.min}
                  onChange={(e) => setPriceFilter({ ...priceFilter, min: e.target.value })}
                />
                <input
                  type="number"
                  className="form-control"
                  placeholder="To"
                  value={priceFilter.max}
                  onChange={(e) => setPriceFilter({ ...priceFilter, max: e.target.value })}
                />
              </div>
              <button
                className="btn btn-sm btn-link text-danger mt-2"
                onClick={() => setPriceFilter({ min: "", max: "" })}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Sort By */}
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted">Sort by:</span>
          <select
            className="form-select"
            style={{ width: "200px" }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Select</option>
            <option value="az">Alphabetically, A–Z</option>
            <option value="za">Alphabetically, Z–A</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <motion.div className="row g-4" variants={containerVariants}>
        {finalProducts.length === 0 ? (
          <div className="text-muted text-center">No products found.</div>
        ) : (
          finalProducts.map((item) => (
            <motion.div
              className="col-12 col-sm-6 col-md-4 col-lg-3"
              key={item.id}
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <div className="product-card shadow-sm">
                <div
                  className="product-img-wrapper position-relative"
                  onClick={() => navigate(`/item/${item.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={item.image} alt={item.title} className="product-img" />
                  {item.status === "in" && (
                    <span className="badge bg-success position-absolute bottom-0 end-0 m-2">Sale</span>
                  )}
                  {item.status === "out" && (
                    <span className="badge bg-danger position-absolute bottom-0 end-0 m-2">Sold Out</span>
                  )}
                </div>
                <div className="card-body">
                  <h6 className="fw-bold">{item.title}</h6>
                  <p className="text-muted small mb-1">
                    {item.description?.slice(0, 40)}...
                  </p>
                  <p className="product-pricing">
                    {item.oldPrice ? (
                      <del className="me-2">£{item.oldPrice.toLocaleString()}</del>
                    ) : null}
                    <strong>£{item.newPrice?.toLocaleString()}</strong>
                  </p>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-dark w-100" onClick={() => handleAddToCart(item)}>
                      Add to Cart
                    </button>
                    <button
                      className="btn btn-sm btn-outline-dark w-100"
                      onClick={() => navigate(`/item/${item.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
};

export default Products;
