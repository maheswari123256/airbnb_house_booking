import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/HouseTypes.css";

const HouseTypes = () => {
  const [houseTypes, setHouseTypes] = useState([]);
  const [newHouseType, setNewHouseType] = useState("");
  const [newIcon, setNewIcon] = useState("");

  const token = localStorage.getItem("token");
  if (!token) window.location.href = "/login";

  // 🔹 Environment-based API
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Load House Types
  const loadHouseTypes = async () => {
    try {
      const res = await fetch(`${API}/api/admin/house-types`, {
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) throw new Error("Failed to load house types");
      const data = await res.json();
      setHouseTypes(data);
    } catch (err) {
      console.error("Error loading house types:", err);
      alert("Failed to load house types. Try again later.");
    }
  };

  useEffect(() => {
    loadHouseTypes();
  }, []);

  // Add House Type
  const handleAddHouseType = async () => {
    if (!newHouseType.trim() || !newIcon.trim()) {
      return alert("Please enter house type & icon");
    }
    try {
      const res = await fetch(`${API}/api/admin/house-types`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newHouseType, icon: newIcon }),
      });
      if (!res.ok) throw new Error("Failed to add house type");
      alert("✅ House type added!");
      setNewHouseType("");
      setNewIcon("");
      loadHouseTypes();
    } catch (err) {
      console.error("Error adding house type:", err);
      alert("Failed to add house type. Try again.");
    }
  };

  // Update House Type
  const handleUpdateHouseType = async (id, currentName, currentIcon) => {
    const updatedName = prompt("Edit house type:", currentName);
    const updatedIcon = prompt("Edit icon URL/path:", currentIcon);
    if (!updatedName || !updatedIcon) return;

    try {
      const res = await fetch(`${API}/api/admin/house-types/${id}`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: updatedName, icon: updatedIcon }),
      });
      if (!res.ok) throw new Error("Failed to update house type");
      alert("✅ House type updated!");
      loadHouseTypes();
    } catch (err) {
      console.error("Error updating house type:", err);
      alert("Failed to update house type. Try again.");
    }
  };

  // Delete House Type
  const handleDeleteHouseType = async (id) => {
    if (!window.confirm("Are you sure you want to delete this house type?")) return;
    try {
      const res = await fetch(`${API}/api/admin/house-types/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) throw new Error("Failed to delete house type");
      alert("✅ House type deleted!");
      loadHouseTypes();
    } catch (err) {
      console.error("Error deleting house type:", err);
      alert("Failed to delete house type. Try again.");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="ht-page d-flex">
      {/* Sidebar */}
      <div className="ht-sidebar bg-dark text-white p-3" style={{ width: '250px', minHeight: '100vh' }}>
        <h3 className="ht-sidebar-title text-white">Admin Panel</h3>
        <a href="/admin-dashboard" className="ht-sidebar-link">🏠 Dashboard</a>
        <a href="/admin/users" className="ht-sidebar-link">👤 Manage Users</a>
        <a href="/admin/properties" className="ht-sidebar-link">🏘 Manage Properties</a>
        <a href="/admin/bookings" className="ht-sidebar-link">📑 Manage Bookings</a>
        <a href="/admin/reviews" className="ht-sidebar-link">⭐ Reviews</a>
        <a href="/admin/amenities" className="ht-sidebar-link">🛠 Amenities</a>
        <a href="/admin/house-types" className="ht-sidebar-link ht-active-link bg-primary rounded">🏡 House Types</a>
        <a href="/login" className="ht-sidebar-link">🚪 Logout</a>
      </div>

      {/* Content */}
      <div className="ht-content flex-grow-1 p-4" style={{ background: "#f8f9fa" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="ht-content-title">🏡 Manage House Types</h2>
          <button className="btn btn-secondary ht-logout-btn" onClick={handleLogout}>Logout</button>
        </div>

        {/* Add New House Type */}
        <div className="card p-3 mb-4 ht-add-card">
          <div className="row g-2">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control ht-input-house"
                placeholder="Enter new house type"
                value={newHouseType}
                onChange={(e) => setNewHouseType(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control ht-input-icon"
                placeholder="Enter icon URL/path"
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value)}
              />
            </div>
            <div className="col-12 mt-2">
              <button className="btn btn-primary w-100 ht-add-btn" onClick={handleAddHouseType}>Add</button>
            </div>
          </div>
        </div>

        {/* House Types Table */}
        <div className="card p-3 ht-table-card">
          <h5>Available House Types</h5>
          <table className="table table-bordered ht-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Icon</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {houseTypes.length === 0 ? (
                <tr><td colSpan="3">No house types found</td></tr>
              ) : (
                houseTypes.map((type) => (
                  <tr key={type._id}>
                    <td>{type.name}</td>
                    <td><img src={type.icon} alt="icon" width="32" height="32" className="ht-icon-img" /></td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleUpdateHouseType(type._id, type.name, type.icon)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteHouseType(type._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HouseTypes;
