import React, { useState } from "react";
import "../styles/ForgetPassword.css";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  // 🔹 Environment-aware API
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("⚠ Please enter a valid email.");
      setStatus("error");
      return;
    }

    try {
      const res = await fetch(`${API}/api/forget/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      setMessage(data.message || "Request completed.");
      setStatus(res.ok ? "success" : "error");
    } catch (error) {
      console.error(error);
      setMessage("❌ Server error. Please try again later.");
      setStatus("error");
    }
  };

  return (
    <div className="fp-page-wrapper">
      <div className="fp-form-card">
        <h2 className="fp-title">Forgot Password</h2>

        <form className="fp-form" onSubmit={handleSubmit}>
          <label className="fp-label">Enter your email</label>

          <input
            type="email"
            className="fp-input"
            placeholder="Your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button className="fp-submit-btn" type="submit">
            Reset Password
          </button>
        </form>

        {message && (
          <p className={`fp-message ${status}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
