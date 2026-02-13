import React, { useState } from "react";
import "../styles/register.css";

// 🔹 API base URL from .env
const API = import.meta.env.VITE_API_URL;

const Register = () => {
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    if (!name || !email || !password) {
      setMsg("All fields are required");
      return;
    }

    let fcmToken = null;

    try {
      // 🔔 STEP 1: Ask notification permission
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        // 🔑 STEP 2: Get FCM token (Firebase v9)
        fcmToken = await getToken(messaging, {
          vapidKey:"BBrUIaTwtbgJ217hXhWuWx3rpB4jU38qTqqjLmQMqZNX8t3p53mRNAUZBddCEoZRRyS2hfVwxj83T4AoBlMSyrc",
        });

        console.log("✅ FCM Token:", fcmToken);
      } else {
        console.log("❌ Notification permission denied");
      }
    } catch (err) {
      console.error("FCM Error:", err);
    }

    try {
      // 🔹 Use API env variable instead of hardcoded localhost
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          fcmToken, // 🔔 token backend ku pogum
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Registration successful!");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        setMsg(data.msg || "Register failed");
      }
    } catch (error) {
      setMsg("Server error");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Signup</h2>

        {msg && <p className="signup-error">{msg}</p>}
        {success && <p className="signup-success">{success}</p>}

        <form onSubmit={handleRegister}>
          <label>Name</label>
          <div className="input-group">
            <i className="fa fa-user" />
            <input type="text" name="name" />
          </div>

          <label>Email</label>
          <div className="input-group">
            <i className="fa fa-envelope" />
            <input type="email" name="email" />
          </div>

          <label>Password</label>
          <div className="input-group">
            <i className="fa fa-lock" />
            <input type="password" name="password" />
          </div>

          <button className="signup-btn">Register</button>
        </form>

        <div className="signup-footer">
          Already have an account? <a href="/login">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
