import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "../styles/CollectionSection.css";

const CATEGORY_API = "https://dexter-e4919-default-rtdb.firebaseio.com/categories.json";

function CollectionSection() {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(CATEGORY_API)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          const formatted = Object.values(data).map((item) => ({
            title: item.name || "Unknown",
            image: item.image || "",
          }));
          setCollections(formatted);
        } else {
          setCollections([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching collections:", error);
        setCollections([]);
        setLoading(false);
      });
  }, []);

  const handleClick = (title) => {
    navigate(`/collection/${encodeURIComponent(title)}`);
  };

  return (
    <div className="container py-5 bg-white">
      <h2 className="text-uppercase fw-bold mb-5 text-center text-dark">
        Dexter Leather Collections
      </h2>

      {loading ? (
        <p className="text-center text-muted">Loading collections...</p>
      ) : collections.length === 0 ? (
        <p className="text-center text-danger">No collections found.</p>
      ) : (
        <div className="row g-4">
          {collections.map((item, index) => (
            <div
              key={index}
              className="col-6 col-sm-6 col-md-3"
              style={{ cursor: "pointer" }}
              onClick={() => handleClick(item.title)}
            >
              <div
                className="card h-100 border-0 shadow-sm"
                style={{
                  transition: "all 0.3s ease",
                  borderRadius: "10px",
                  backgroundColor: "#fff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
                }}
              >
                <div
                  className="ratio ratio-4x3 overflow-hidden"
                  style={{ borderRadius: "10px 10px 0 0" }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="card-img-top"
                    style={{ objectFit: "cover", height: "100%" }}
                    loading="lazy"
                  />
                </div>
                <div className="card-body d-flex justify-content-between align-items-center">
                  <h5 className="card-title text-dark mb-0 fw-semibold">{item.title}</h5>
                  <ArrowForwardIcon fontSize="small" style={{ color: "#333" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CollectionSection;
