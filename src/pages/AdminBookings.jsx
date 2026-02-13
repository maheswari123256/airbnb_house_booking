import React, { useEffect, useState } from "react";
import "../styles/AdminBookings.css";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyD8DOpnDhFMXXVOscjhLoW3If0ZhlKUBpo",
  authDomain: "staynotify-61da5.firebaseapp.com",
  projectId: "staynotify-61da5",
  storageBucket: "staynotify-61da5.firebasestorage.app",
  messagingSenderId: "580938949690",
  appId: "1:580938949690:web:2b6234577a9cbe7aad4103",
};

initializeApp(firebaseConfig);

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    flatpickr(".admin-bookings-checkin", { dateFormat: "Y-m-d" });
    flatpickr(".admin-bookings-checkout", { dateFormat: "Y-m-d" });
  }, []);

  useEffect(() => {
    fetchBookings();
    initFirebaseNotifications();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = awaitfetch(`${import.meta.env.VITE_API_URL}/api/booking/booking`, {

        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBookings(data || []);
    } catch (err) {
      console.error("❌ Error loading bookings", err);
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/booking/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("✅ Booking cancelled");
        fetchBookings();
      } else {
        alert("❌ Failed to cancel booking");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const initFirebaseNotifications = async () => {
    const messaging = getMessaging();

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    try {
      const fcmToken = await getToken(messaging);
      await fetch(`${import.meta.env.VITE_API_URL}/api/user/save-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token: fcmToken }),
      });
    } catch (err) {
      console.error("❌ FCM error", err);
    }

    onMessage(messaging, (payload) => {
      new Notification(payload.notification.title, {
        body: payload.notification.body,
      });
    });
  };

  return (
    <div className="admin-bookings-container">
      <aside className="admin-bookings-sidebar">
        <h4>Admin Panel</h4>
        <a href="/admin-dashboard">Dashboard</a>
        <a href="/admin/users">Users</a>
        <a href="/admin/properties">Properties</a>
        <a className="active">Bookings</a>
        <a href="/admin/amenities">Amenities</a>
        <a href="/admin/reviews">Reviews</a>
          <a href="/admin/house-types">🏡 House Types</a>
      </aside>

      <main className="admin-bookings-content">
        <h3>Bookings</h3>

        <div className="admin-bookings-card">
          <table className="admin-bookings-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Property</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b._id}>
                    <td>{b.user?.email || "N/A"}</td>
                    <td>{b.property?.title || "N/A"}</td>
                    <td>{new Date(b.checkIn).toLocaleDateString()}</td>
                    <td>{new Date(b.checkOut).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="admin-bookings-cancel-btn"
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
      </main>
    </div>
  );
};

export default AdminBookings;
