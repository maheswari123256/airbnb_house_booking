import React, { useState } from "react";
import "../styles/login.css";

const Login = () => {
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // optional spinner state

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    if (!email || !password) {
      setMsg("Fill all fields");
      return;
    }

    setLoading(true);
    let fcmToken = null;

    // ✅ FCM token (optional, requires Firebase setup)
    try {
      if (Notification.permission === "granted") {
        fcmToken = await messaging.getToken(); // make sure messaging is imported & initialized
      }
    } catch (err) {
      console.error("FCM error:", err);
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fcmToken }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ ROLE-BASED REDIRECT
        if (data.user?.role === "admin") {
          window.location.href = "/admin-dashboard";
        } else if (data.user?.role === "host") {
          window.location.href = "/host-dashboard";
        } else {
          window.location.href = "/house";
        }
      } else {
        if (res.status === 404 || data.msg === "User not registered") {
          window.location.href = "/register";
        } else {
          setMsg(data.msg || "Login failed");
        }
      }
    } catch (err) {
      console.error(err);
      setMsg("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          {msg && <div className="message">{msg}</div>}

          <div className="input-box">
            <input type="email" name="email" placeholder="Email" required />
          </div>

          <div className="input-box password-box">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              👁
            </button>
          </div>

          <div className="options">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
            <a href="/forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="signup">
          Don't have an account? <a href="/register">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
