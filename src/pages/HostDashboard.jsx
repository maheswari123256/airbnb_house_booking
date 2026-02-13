import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/hostDashboard.css";

const HostDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingRequests: 0,
    earnings: 0,
  });

  // 🔹 Environment-aware API
  const API = import.meta.env.VITE_API_URL || "";

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const loadDashboardStats = async () => {
    try {
      const res = await fetch(`${API}/api/hostStats/dashboard`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });

      if (!res.ok) throw new Error("Failed to fetch dashboard stats");

      const data = await res.json();
      setStats({
        totalBookings: data.totalBookings || 0,
        pendingRequests: data.pendingRequests || 0,
        earnings: data.totalEarnings || 0,
      });
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      // Optional: show alert or toast
    }
  };

  useEffect(() => {
    loadDashboardStats();
  }, []);

  return (
    <div className="host-dashboard-body d-flex position-relative">
      {/* Sidebar */}
      <div className="host-dashboard-sidebar">
        <h3>Host Panel</h3>
        <Link to="/add-property">
          <button>Add New Property</button>
        </Link>

        <Link to="/my-properties">My Listings</Link>
        <button onClick={logout}>Logout</button>
      </div>

      {/* Main Content */}
      <div className="host-dashboard-main flex-grow-1">
        {/* Top-right switch button */}
        <div className="host-dashboard-top-actions d-flex justify-content-end mb-3">
          <Link to="/house">
            <button>Switch to travelling</button>
          </Link>
        </div>

        <h2>Welcome, Host!</h2>

        <div className="row mt-4">
          <div className="col-md-4">
            <div className="host-dashboard-card">
              <div className="card-body">
                <h5 className="host-dashboard-card-title">Total Bookings</h5>
                <p className="host-dashboard-card-text">{stats.totalBookings}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="host-dashboard-card">
              <div className="card-body">
                <h5 className="host-dashboard-card-title">Pending Requests</h5>
                <p className="host-dashboard-card-text">{stats.pendingRequests}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="host-dashboard-card">
              <div className="card-body">
                <h5 className="host-dashboard-card-title">Earnings</h5>
                <p className="host-dashboard-card-text">{stats.earnings}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;
