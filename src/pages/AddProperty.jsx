import React, { useEffect, useState } from "react";
import "../styles/add-property.css";

const AddProperty = () => {
  const [amenities, setAmenities] = useState([]);
  const [houseTypes, setHouseTypes] = useState([]);

  useEffect(() => {
    loadAmenities();
    loadHouseTypes();
  }, []);

  const loadAmenities = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/amenities`);
      const data = await res.json();
      setAmenities(data);
    } catch (err) {
      console.error("Amenity Load Error:", err);
      alert("❌ Failed to load amenities");
    }
  };

  const loadHouseTypes = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/house-types`);
      const data = await res.json();
      setHouseTypes(data);
    } catch (err) {
      console.error("House Type Load Error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("❌ You must be logged in to add a property");
      return;
    }

    const formData = new FormData(e.target);

    const selectedAmenities = Array.from(
      document.querySelectorAll('input[name="amenity"]:checked')
    ).map((cb) => cb.value);

    formData.append("amenities", JSON.stringify(selectedAmenities));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/house/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Property added successfully!");
        window.location.href = "/my-properties";
      } else {
        alert("❌ " + (data.message || "Failed to add property"));
      }
    } catch (err) {
      console.error("Request Error:", err);
      alert("❌ Error adding property");
    }
  };

  return (
    <div className="add-property-container">
      <h2>Add New Property</h2>

      <form onSubmit={handleSubmit} className="add-property-form">
        <input name="title" placeholder="Title" required />
        <input name="description" placeholder="Description" required />
        <input name="location" placeholder="Location" required />
        <input type="number" name="price" placeholder="Price (₹)" required />

        <label>Select House Type</label>
        <select name="houseType" required>
          <option value="">Select</option>
          {houseTypes.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        <h3>Guest Capacity</h3>
        <input
          type="number"
          name="adults"
          placeholder="Max Adults"
          min="0"
          required
        />
        <input
          type="number"
          name="children"
          placeholder="Max Children"
          min="0"
        />
        <input type="number" name="infants" placeholder="Max Infants" min="0" />
        <input type="number" name="pets" placeholder="Max Pets" min="0" />

        <label>Max Guests Allowed</label>
        <input type="number" name="maxGuests" min="1" required />

        <label>Upload Interior Images</label>
        <input type="file" name="interior" multiple required />

        <label>Upload Exterior Images</label>
        <input type="file" name="exterior" multiple required />

        <div className="amenities-box">
          <strong>Select Amenities</strong>
          {amenities.map((a) => (
            <div className="amenity-option" key={a._id}>
              <input type="checkbox" name="amenity" value={a._id} />
              <img src={a.iconUrl} alt={a.type} />
              <span>{a.type}</span>
            </div>
          ))}
        </div>

        <button type="submit">Add Property</button>
      </form>
    </div>
  );
};

export default AddProperty;
