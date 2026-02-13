import React, { useEffect, useState } from "react";
import "../styles/HouseCategory.css";

const HousesByType = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  const params = new URLSearchParams(window.location.search);
  const typeId = params.get("typeId");

  useEffect(() => {
    if (!typeId) return;

    const fetchHouses = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/house/by-type/${typeId}`
        );
        const data = await res.json();
        setHouses(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHouses();
  }, [typeId]);

  if (!typeId) {
    return <p className="typeHouse-message">No house type selected.</p>;
  }

  if (loading) {
    return <p className="typeHouse-message">Loading...</p>;
  }

  if (!houses.length) {
    return <p className="typeHouse-message">No houses found for this type.</p>;
  }

  return (
    <div className="typeHouse-wrapper">
      <h1 className="typeHouse-title">Houses of Selected Type</h1>

      <div className="typeHouse-container">
        {houses.map((house) => (
          <div key={house._id} className="typeHouse-card">
            <img
              className="typeHouse-image"
              src={
                house.images?.[0]?.urls?.[0] ||
                "https://via.placeholder.com/250x150?text=No+Image"
              }
              alt={house.title}
            />

            <h3 className="typeHouse-cardTitle">{house.title}</h3>

            <p className="typeHouse-description">
              {house.description || ""}
            </p>

            <p className="typeHouse-price">₹{house.pricePerNight}</p>

            <a
              className="typeHouse-viewBtn"
              href={`/house-details/${house._id}`}
            >
              View Details
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HousesByType;
