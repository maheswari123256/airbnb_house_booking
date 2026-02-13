import React, { useEffect, useState } from "react";
import "../styles/ManageAmenities.css";

const ManageAmenities = () => {
  const [amenities, setAmenities] = useState([]);
  const [newType, setNewType] = useState("");
  const [newIcon, setNewIcon] = useState("");

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
  }

  // 🔹 Environment-based API
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };

  // Load amenities from API
  const loadAmenities = async () => {
    try {
      const res = await fetch(`${API}/api/admin/amenities`, { headers });
      if (!res.ok) throw new Error("Failed to load amenities");
      const data = await res.json();
      setAmenities(data);
    } catch (err) {
      console.error("Error loading amenities:", err);
      alert("Failed to load amenities. Please try again.");
    }
  };

  // Add new amenity
  const addAmenity = async () => {
    if (!newType.trim()) {
      alert("Enter amenity name");
      return;
    }

    try {
      const res = await fetch(`${API}/api/admin/amenities`, {
        method: "POST",
        headers,
        body: JSON.stringify({ type: newType, iconUrl: newIcon }),
      });
      if (!res.ok) throw new Error("Failed to add amenity");

      setNewType("");
      setNewIcon("");
      loadAmenities();
      alert("✅ Amenity added successfully!");
    } catch (err) {
      console.error("Error adding amenity:", err);
      alert("Failed to add amenity. Try again.");
    }
  };

  // Update amenity
  const updateAmenity = async (id, type, iconUrl) => {
    try {
      const res = await fetch(`${API}/api/admin/amenities/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ type, iconUrl }),
      });
      if (!res.ok) throw new Error("Failed to update amenity");
      loadAmenities();
    } catch (err) {
      console.error("Error updating amenity:", err);
      alert("Failed to update amenity. Try again.");
    }
  };

  // Delete amenity
  const deleteAmenity = async (id) => {
    if (!window.confirm("Delete amenity?")) return;
    try {
      const res = await fetch(`${API}/api/admin/amenities/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error("Failed to delete amenity");
      loadAmenities();
      alert("✅ Amenity deleted successfully!");
    } catch (err) {
      console.error("Error deleting amenity:", err);
      alert("Failed to delete amenity. Try again.");
    }
  };

  useEffect(() => {
    loadAmenities();
  }, []);

  return (
    <div className="amenities-page-container">
      {/* Header with page title + top-right button */}
      <div className="amenities-header-bar">
        <h1 className="amenities-page-title">Amenities</h1>
        <button
          className="amenities-top-dashboard-button"
          onClick={() => (window.location.href = "/admin-dashboard")}
        >
          ⬅ Back to Dashboard
        </button>
      </div>

      {/* Add Form */}
      <div className="amenities-add-form">
        <input
          className="amenities-input-type"
          placeholder="Amenity name"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
        />
        <input
          className="amenities-input-icon"
          placeholder="Icon URL"
          value={newIcon}
          onChange={(e) => setNewIcon(e.target.value)}
        />
        <button className="amenities-add-button" onClick={addAmenity}>
          Add
        </button>
      </div>

      {/* Table */}
      <table className="amenities-table">
        <thead className="amenities-table-head">
          <tr className="amenities-table-row-head">
            <th className="amenities-th-name">Name</th>
            <th className="amenities-th-icon">Icon</th>
            <th className="amenities-th-action">Action</th>
          </tr>
        </thead>

        <tbody className="amenities-table-body">
          {amenities.length === 0 ? (
            <tr className="amenities-no-data-row">
              <td colSpan="3" className="amenities-no-data-text">
                No amenities
              </td>
            </tr>
          ) : (
            amenities.map((amenity) => (
              <tr className="amenities-data-row" key={amenity._id}>
                <td className="amenities-td-name">
                  <input
                    className="amenities-edit-name-input"
                    defaultValue={amenity.type}
                    onBlur={(e) =>
                      updateAmenity(amenity._id, e.target.value, amenity.iconUrl)
                    }
                  />
                </td>

                <td className="amenities-td-icon">
                  <img
                    className="amenities-icon-image"
                    src={amenity.iconUrl || ""}
                    alt={amenity.type}
                  />
                  <input
                    className="amenities-edit-icon-input"
                    defaultValue={amenity.iconUrl || ""}
                    onBlur={(e) =>
                      updateAmenity(amenity._id, amenity.type, e.target.value)
                    }
                  />
                </td>

                <td className="amenities-td-action">
                  <button
                    className="amenities-delete-button"
                    onClick={() => deleteAmenity(amenity._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageAmenities;
