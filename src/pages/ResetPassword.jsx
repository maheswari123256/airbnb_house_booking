import React, { useState } from "react";
import "../styles/reset-password.css";

// 🔹 API base URL from .env
const API = import.meta.env.VITE_API_URL;

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // get token from URL
  const token = window.location.pathname.split("/").pop();

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🔹 Use API env variable instead of localhost
      const res = await fetch(`${API}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Password updated successfully!");
        window.location.href = "/login";
      } else {
        setMessage(data.message || "Something went wrong");
        setIsError(true);
      }
    } catch (error) {
      setMessage("Server error. Please try again later.");
      setIsError(true);
    }
  };

  return (
    <div className="rp-page-wrapper">
      <div className="rp-form-card">
        <h2 className="rp-title">Reset Password</h2>

        <form className="rp-form" onSubmit={handleResetSubmit}>
          <input
            type="password"
            className="rp-input"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button type="submit" className="rp-submit-btn">
            Update Password
          </button>
        </form>

        {message && (
          <p className={isError ? "rp-message-error" : "rp-message-success"}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
