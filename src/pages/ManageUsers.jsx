import React, { useEffect, useState } from "react";
import "../styles/manageUsers.css";

// 🔹 Use environment variable for API base URL
const API = import.meta.env.VITE_API_URL;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  // 🔹 Fetch all users
  useEffect(() => {
    fetch(`${API}/api/admin/users`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, [token]);

  // 🔹 Delete user
  const deleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      fetch(`${API}/api/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to delete user");
          setUsers(users.filter((user) => user._id !== id));
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="mu-container">
      <h1 className="mu-title">👥 Users Management</h1>

      <div className="amenities-header-bar">
        <h1 className="amenities-page-title">Amenities</h1>

        <button
          className="amenities-top-dashboard-button"
          onClick={() => (window.location.href = "/admin-dashboard")}
        >
          ⬅ Back to Dashboard
        </button>
      </div>

      <div className="mu-table-wrapper">
        <table className="table table-hover align-middle mu-table">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role || "User"}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm mu-delete-btn"
                      onClick={() => deleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
