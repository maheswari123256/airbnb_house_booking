import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/adminManageProperties.css";

const AdminManageProperties = () => {
  const [propertiesData, setPropertiesData] = useState([]);
  const [search, setSearch] = useState("");
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000"; // fallback

  // 🔹 Load properties
  const loadProperties = async () => {
    try {
      const res = await fetch(`${API}/api/admin/properties`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (!res.ok) throw new Error("Failed to fetch properties");

      const data = await res.json();
      setPropertiesData(data);
    } catch (err) {
      console.error(err);
      alert("❌ Error loading properties");
    }
  };

  // 🔹 Delete property
  const deleteProperty = async (id) => {
    if (!window.confirm("⚠ Are you sure you want to delete this property?")) return;

    try {
      const res = await fetch(`${API}/api/admin/properties/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (!res.ok) throw new Error("Delete failed");

      alert("✅ Property deleted successfully");
      loadProperties();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete property");
    }
  };

  // 🔹 Filter properties by search
  const filteredProperties = propertiesData.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.location?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    loadProperties();
  }, []);

  return (
    <div className="admin-prop-page">
      <div className="admin-prop-container container">
        <h1 className="admin-prop-title text-center">🏠 Property Management</h1>

        <div className="amenities-header-bar mb-3 d-flex justify-content-between align-items-center">
          <h1 className="amenities-page-title">Amenities</h1>
          <button
            className="amenities-top-dashboard-button btn btn-secondary"
            onClick={() => (window.location.href = "/admin-dashboard")}
          >
            ⬅ Back to Dashboard
          </button>
        </div>

        {/* Search + Refresh */}
        <div className="admin-prop-controls d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            className="admin-prop-search form-control w-50"
            placeholder="🔍 Search properties by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="admin-prop-refresh-btn btn btn-primary" onClick={loadProperties}>
            ⟳ Refresh
          </button>
        </div>

        {/* Table */}
        <table className="admin-prop-table table table-bordered table-hover text-center">
          <thead className="admin-prop-thead">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Location</th>
              <th>Price (₹)</th>
              <th>Owner</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody className="admin-prop-tbody">
            {filteredProperties.map((prop, index) => (
              <tr key={prop._id} className="admin-prop-row">
                <td>{index + 1}</td>
                <td>{prop.title || "N/A"}</td>
                <td>{prop.location || "N/A"}</td>
                <td>{prop.pricePerNight ?? "N/A"}</td>
                <td>{prop.hostId?.name || "N/A"}</td>
                <td>
                  <button
                    className="admin-prop-delete-btn btn btn-sm btn-danger"
                    onClick={() => deleteProperty(prop._id)}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredProperties.length === 0 && (
              <tr>
                <td colSpan="6" className="text-muted">
                  No properties found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminManageProperties;
