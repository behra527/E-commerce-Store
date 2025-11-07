import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ITEM_API = "https://dexter-e4919-default-rtdb.firebaseio.com/item.json";

function CollectionItems() {
  const { categoryName } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await fetch(ITEM_API);
        const data = await res.json();

        if (data) {
          const filtered = Object.entries(data)
            .filter(
              ([, item]) =>
                item.category?.toLowerCase() === categoryName.toLowerCase()
            )
            .map(([id, item]) => ({ id, ...item }));

          setItems(filtered);
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [categoryName]);

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-uppercase fw-bold border-bottom pb-2">
        {categoryName} Collection
      </h2>

      {loading ? (
        <p className="text-muted">Loading items...</p>
      ) : items.length === 0 ? (
        <p className="text-muted">No items found in this collection.</p>
      ) : (
        <div className="row g-4">
          {items.map((item, index) => (
            <div key={item.id} className="col-12 col-sm-6 col-md-4">
              <div
                className="card h-100 border-0 shadow-sm"
                style={{
                  cursor: "pointer",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 24px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 15px rgba(0, 0, 0, 0.1)";
                }}
                onClick={() => navigate(`/item/${item.id}`)}
              >
                <div
                  className="ratio ratio-4x3"
                  style={{
                    borderRadius: "0.5rem 0.5rem 0 0",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={item.mainImage}
                    alt={item.name}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title fw-semibold">{item.name}</h5>
                  <p className="card-text text-muted small">
                    {item.description?.slice(0, 60)}...
                  </p>
                  <p className="fw-bold text-success fs-5">£{item.price}</p>

                  {/* Colors */}
                  {item.colors && item.colors.length > 0 && (
                    <div className="mb-2">
                      {item.colors.map((color, i) => (
                        <span
                          key={i}
                          className="badge rounded-pill bg-dark me-1"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Gallery */}
                  {item.gallery?.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {item.gallery.slice(0, 4).map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="gallery"
                          className="border rounded"
                          style={{
                            width: "45px",
                            height: "45px",
                            objectFit: "cover",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CollectionItems;
