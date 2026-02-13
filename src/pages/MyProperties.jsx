import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MyProperties.css";

// 🔹 Use environment variable for API base URL
const API = import.meta.env.VITE_API_URL;

const MyProperties = () => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🔹 Fetch user's properties
  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/api/house/my-properties`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setListings(data);
    } catch (err) {
      console.error("❌ Error fetching listings:", err);
      setError("❌ Failed to load your properties. Please try again.");
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // 🔹 Delete property
  const deleteListing = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API}/api/house/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        alert("❌ Failed to delete listing");
        return;
      }

      alert("🗑️ Listing deleted");
      fetchProperties();
    } catch (err) {
      console.error("❌ Error deleting listing:", err);
    }
  };

  // 🔹 Navigate to edit page
  const editListing = (id) => {
    navigate(`/edit-property?id=${id}`);
  };

  return (
    <div className="my-properties-page">
      <h2 className="page-title">🗂️ My Property Listings</h2>

      {error && <p className="error-text">{error}</p>}

      {listings.map((property) => {
        const firstImage =
          Array.isArray(property.images) &&
          property.images.length > 0 &&
          Array.isArray(property.images[0].urls) &&
          property.images[0].urls.length > 0
            ? property.images[0].urls[0]
            : null;

        return (
          <div key={property._id} className="listing-card">
            <h3 className="property-title">{property.title || "No Title"}</h3>

            <p className="property-description">
              {property.description || "No Description"}
            </p>

            <p className="property-location">
              <strong className="label">📍 Location:</strong>{" "}
              <span className="value">{property.location || "N/A"}</span>
            </p>

            <p className="property-price">
              <strong className="label">💰 Price:</strong>{" "}
              <span className="value">₹{property.pricePerNight || "0"}</span>
            </p>

            {firstImage && (
              <img src={firstImage} alt="Property" className="property-img" />
            )}

            <div className="amenities">
              {Array.isArray(property.amenities) &&
              property.amenities.length > 0 ? (
                property.amenities.map((a, index) => (
                  <div key={index} className="amenity">
                    <img src={a.iconUrl} alt={a.type} className="amenity-icon" />
                    <span className="amenity-text">{a.type}</span>
                  </div>
                ))
              ) : (
                <i className="no-amenities">No amenities listed</i>
              )}
            </div>

            <div className="action-buttons">
              <button className="btn edit-btn" onClick={() => editListing(property._id)}>
                ✏️ Edit
              </button>

              <button className="btn delete-btn" onClick={() => deleteListing(property._id)}>
                🗑️ Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyProperties;
