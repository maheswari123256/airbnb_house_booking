import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaHome, FaUsers, FaBuilding, FaCalendarCheck, FaCouch, FaStar, FaTrash } from "react-icons/fa";
import "../styles/ReviewsDashboard.css";

// 🔹 API base URL from .env
const API = import.meta.env.VITE_API_URL;

const ReviewsDashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const loadReviews = async () => {
    try {
      const res = await fetch(`${API}/api/admin/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setReviews(data || []);
    } catch (err) {
      console.error("Error loading reviews:", err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      const res = await fetch(`${API}/api/admin/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      alert(data.message || "Review deleted");
      loadReviews();
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("❌ Failed to delete review");
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <div className="reviews-dashboard-container">
      <div className="row m-0">
        {/* Sidebar */}
        <div className="col-md-2 reviews-sidebar p-0">
          <h4 className="text-center py-3 reviews-sidebar-title">Admin Panel</h4>
          <a href="/admin-dashboard" className="reviews-sidebar-link"><FaHome className="me-2" /> Dashboard</a>
          <a href="/admin/users" className="reviews-sidebar-link"><FaUsers className="me-2" /> Users</a>
          <a href="/admin/properties" className="reviews-sidebar-link"><FaBuilding className="me-2" /> Properties</a>
          <a href="/admin/bookings" className="reviews-sidebar-link"><FaCalendarCheck className="me-2" /> Bookings</a>
          <a href="/admin/house-types" className="reviews-sidebar-link"><FaHome className="me-2" /> House Types</a>
          <a href="/admin/amenities" className="reviews-sidebar-link"><FaCouch className="me-2" /> Amenities</a>
          <a href="/admin/reviews" className="reviews-sidebar-link active"><FaStar className="me-2" /> Reviews</a>
        </div>

        {/* Main Content */}
        <div className="col-md-10 reviews-content p-4">
          <h2 className="mb-4"><FaStar className="text-warning me-2" /> Manage Reviews</h2>

          {loading ? (
            <p>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p>No reviews found.</p>
          ) : (
            <div className="reviews-list">
              {reviews.map((r) => (
                <div key={r._id} className="review-card shadow-sm">
                  <div className="review-header">
                    <div>
                      <strong>{r.userId?.name || "Anonymous"}</strong>
                      <br />
                      <small>{r.userId?.email || ""}</small>
                    </div>
                    <div>
                      <span className="review-rating">⭐ {r.rating}</span>
                    </div>
                  </div>
                  <div className="review-body">
                    <p>{r.comment || "No comment"}</p>
                  </div>
                  <div className="review-footer">
                    <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteReview(r._id)}>
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsDashboard;
