import React from "react";
import { useNavigate } from "react-router-dom";

const HouseCard = ({ house, wishlistItems, toggleWishlist }) => {
  const navigate = useNavigate();
  const isWishlisted = wishlistItems.includes(house._id);

  const goToDetails = () => {
    navigate(`/house-details/${house._id}`);
  };

  // ✅ API base URL
  const API = import.meta.env.VITE_API_URL;

  // ✅ Get first image URL safely
  const imageUrl = house.images?.[0]?.urls?.[0]
    ? house.images[0].urls[0].startsWith("http")
      ? house.images[0].urls[0]
      : `${API}/${house.images[0].urls[0]}`
    : "/placeholder.jpg"; // fallback if no image

  return (
    <div className="card" data-id={house._id} onClick={goToDetails} style={{ cursor: 'pointer' }}>
      <img src={imageUrl} alt={house.title} />

      <div
        className={`wishlist ${isWishlisted ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation(); // prevent card click
          toggleWishlist(house._id);
        }}
      >
        ♡
      </div>

      <div className="info">
        <h3>{house.title}</h3>
        <p>{house.location}</p>
        <p className="price">₹{house.pricePerNight}/night</p>
        <p>⭐ {house.rating || "4.5"} ({house.reviews?.length || 0} reviews)</p>
      </div>
    </div>
  );
};

export default HouseCard;
