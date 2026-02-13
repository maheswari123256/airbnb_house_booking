import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../styles/editProperty.css";

const EditProperty = () => {
  const [amenities, setAmenities] = useState([]);
  const [property, setProperty] = useState(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const propertyId = searchParams.get("id");
  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL || ""; // fallback

  // 🔹 Load property & amenities
  useEffect(() => {
    const loadPropertyAndAmenities = async () => {
      try {
        // Property
        const propRes = await fetch(`${API}/api/house/${propertyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!propRes.ok) throw new Error("Failed to fetch property");
        const propData = await propRes.json();

        // Amenities
        const amenRes = await fetch(`${API}/api/amenities`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!amenRes.ok) throw new Error("Failed to fetch amenities");
        const amenData = await amenRes.json();

        setProperty(propData);
        setAmenities(amenData);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load property or amenities");
      }
    };

    loadPropertyAndAmenities();
  }, [propertyId, token, API]);

  // 🔹 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const res = await fetch(`${API}/api/house/update/${propertyId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      alert("✅ Property updated successfully!");
      navigate("/my-properties");
    } catch (err) {
      console.error(err);
      alert("❌ " + err.message);
    }
  };

  if (!property) return <p>Loading...</p>;

  return (
    <div className="edit-property-page">
      <h1>Edit Property</h1>

      <form
        className="edit-property-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        {/* Basic Info */}
        <input
          className="form-input"
          name="title"
          defaultValue={property.title}
          placeholder="Title"
          required
        />
        <input
          className="form-input"
          name="description"
          defaultValue={property.description}
          placeholder="Description"
          required
        />
        <input
          className="form-input"
          name="location"
          defaultValue={property.location}
          placeholder="Location"
          required
        />
        <input
          className="form-input"
          name="price"
          type="number"
          defaultValue={property.pricePerNight}
          placeholder="Price (₹)"
          required
        />

        {/* Guest Capacity */}
        <h3>Guest Capacity</h3>
        <input
          className="form-input"
          name="adults"
          type="number"
          defaultValue={property.guestCapacity?.adults}
          placeholder="Max Adults"
        />
        <input
          className="form-input"
          name="children"
          type="number"
          defaultValue={property.guestCapacity?.children}
          placeholder="Max Children"
        />
        <input
          className="form-input"
          name="infants"
          type="number"
          defaultValue={property.guestCapacity?.infants}
          placeholder="Max Infants"
        />
        <input
          className="form-input"
          name="pets"
          type="number"
          defaultValue={property.guestCapacity?.pets}
          placeholder="Max Pets"
        />
        <input
          className="form-input"
          name="maxGuests"
          type="number"
          defaultValue={property.guestCapacity?.maxGuests}
          placeholder="Total Guests"
        />

        {/* Images */}
        <h3>Upload Interior Images</h3>
        <input className="form-input" type="file" name="interior" multiple />
        <h3>Upload Exterior Images</h3>
        <input className="form-input" type="file" name="exterior" multiple />

        {/* Amenities */}
        <h3>Select Amenities</h3>
        <div className="amenities-container">
          {amenities.map((amenity) => {
            const checked = property.amenities?.some((a) => a._id === amenity._id);
            return (
              <label key={amenity._id} className="amenity-option">
                <input
                  type="checkbox"
                  name="amenities"
                  value={amenity._id}
                  defaultChecked={checked}
                />
                <img src={amenity.iconUrl} alt={amenity.type} />
                {amenity.type}
              </label>
            );
          })}
        </div>

        <button className="update-btn" type="submit">
          Update Property
        </button>
      </form>
    </div>
  );
};

export default EditProperty;
