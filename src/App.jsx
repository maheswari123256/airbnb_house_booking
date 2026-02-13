import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import House from "./pages/House";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HostDashboard from "./pages/HostDashboard";
import HouseDetails from "./pages/HouseDetails";
import AddProperty from "./pages/AddProperty";
import MyProperties from "./pages/MyProperties";
import EditProperty from "./pages/EditProperty";
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import AdminManageProperties from "./pages/AdminManageProperties";
import AdminBookings from "./pages/AdminBookings";
import ManageAmenities from "./pages/ManageAmenities";
import ReviewsDashboard from "./pages/ReviewsDashboard";
import HouseTypes from "./pages/HouseTypes";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import HouseCategory from "./pages/HouseCategory";





const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<House />} />
        <Route path="/house" element={<House />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword/>} />
          <Route path="/housecategory" element={<HouseCategory/>}/>

        {/* Host Routes */}
        <Route path="/host-dashboard" element={<HostDashboard />} />
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/my-properties" element={<MyProperties />} />
        <Route path="/edit-property" element={<EditProperty />} />

        {/* House */}
        <Route
          path="/house-details/:houseId"
          element={<HouseDetails />}
        />

        {/* Admin Route (NEW – SAFE) */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/properties" element={<AdminManageProperties />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/amenities" element={<ManageAmenities />} />
         <Route path="/admin/reviews" element={<ReviewsDashboard />} /> 
         <Route path="/admin/house-types" element={<HouseTypes />} />

        

      </Routes>
    </Router>
  );
};

export default App;
