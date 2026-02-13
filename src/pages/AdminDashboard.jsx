import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import "../styles/adminDashboard.css";

const AdminDashboard = () => {
  const token = localStorage.getItem("token");

  // ✅ STATES (instead of innerText)
  const [stats, setStats] = useState({
    users: 0,
    properties: 0,
    bookings: 0,
    reviews: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);

  // ✅ Chart refs
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  /* ================== FETCH DASHBOARD DATA ================== */
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/dashboard`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        setStats({
          users: data.usersCount,
          properties: data.propertyCount,
          bookings: data.bookingCount,
          reviews: data.reviewCount || 0,
        });
      });
  }, [token]);

  /* ================== CHART ================== */
  useEffect(() => {
    const ctx = chartRef.current;

    if (!ctx) return;

    // destroy previous chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [
          {
            label: "Bookings",
            data: [10, 20, 30, 25, 40, 35, 50],
            borderColor: "#007bff",
            backgroundColor: "rgba(0,123,255,0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  /* ================== RECENT BOOKINGS ================== */
  useEffect(() => {
   fetch(`${import.meta.env.VITE_API_URL}/api/admin/booking`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => setRecentBookings(data));
  }, [token]);

  /* ================== CANCEL BOOKING ================== */
  const cancelBooking = (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/admin/booking/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    })
      .then(() => {
        alert("✅ Booking cancelled successfully");
        setRecentBookings((prev) =>
          prev.filter((booking) => booking._id !== id)
        );
      })
      .catch(() => alert("❌ Failed to cancel booking"));
  };

  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <h3 className="text-white">Admin Panel</h3>
        <a href="/admin-dashboard">🏠 Dashboard</a>
        <a href="/admin/users">👤 Manage Users</a>
        <a href="/admin/properties">🏘 Manage Properties</a>
        <a href="/admin/bookings">📑 Manage Bookings</a>
        <a href="/admin/reviews">⭐ Reviews</a>
        <a href="/admin/amenities">🛠 Amenities</a>
        <a href="/admin/house-types">🏡 House Types</a>
        <a href="/login">🚪 Logout</a>
      </div>

      {/* Content */}
      <div className="admin-content">
        <h2 className="mb-4">Welcome, Admin</h2>

        {/* Stats */}
        <div className="row g-4 mb-4">
          <StatCard title="Total Users" value={stats.users} />
          <StatCard title="Total Properties" value={stats.properties} />
          <StatCard title="Total Bookings" value={stats.bookings} />
          <StatCard title="Total Reviews" value={stats.reviews} />
        </div>

        {/* Chart */}
        <div className="row g-4">
          <div className="col-md-8">
            <div className="card admin-card p-3">
              <h5>📈 Bookings Overview</h5>
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="card admin-card mt-4 p-3">
          <h5>📑 Recent Bookings</h5>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>User</th>
                <th>Property</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan="6">No bookings found.</td>
                </tr>
              ) : (
                recentBookings.slice(0, 5).map((b) => (
                  <tr key={b._id}>
                    <td>{b.userId?.email || "N/A"}</td>
                    <td>{b.houseId?.title || "N/A"}</td>
                    <td>{new Date(b.checkOut).toLocaleDateString()}</td>
                    <td>₹{b.totalAmount || 0}</td>
                    <td>{b.bookingStatus || "Pending"}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => cancelBooking(b._id)}
                      >
                        Cancel
                      </button>
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

/* ================== SMALL COMPONENT ================== */
const StatCard = ({ title, value }) => (
  <div className="col-md-3">
    <div className="card admin-card text-center p-3">
      <h5>{title}</h5>
      <h3>{value}</h3>
    </div>
  </div>
);

export default AdminDashboard;
