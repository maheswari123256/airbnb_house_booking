import React, { useEffect } from "react";
import { Dropdown } from "bootstrap"; // import Bootstrap JS

import { Link } from "react-router-dom";
import logo from "../images/logo.svg";
import langIcon from "../images/language-icon.svg";
import userIcon from "../images/user-icon.svg";

const Header = () => {
  useEffect(() => {
    const dropdowns = document.querySelectorAll(".dropdown-toggle");
    dropdowns.forEach((el) => {
      new Dropdown(el);
    });
  }, []);

  return (
    <header className="own-container d-flex align-items-center">
      {/* Logo */}
      <div className="logo d-flex align-items-center flex-grow-1">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>

      {/* Search Buttons */}
      <div className="search d-flex align-items-center justify-content-center flex-grow-2">
        <button className="btn">Where</button>
        <span>|</span>
        <button className="btn">Check in</button>
        <span>|</span>
        <button className="btn">Check out</button>
        <span>|</span>
        <button className="btn search-guest">
          Who
          <span className="ms-1">🔍</span>
        </button>
      </div>

      {/* Right Side */}
      <div className="right-bar d-flex justify-content-end flex-grow-1">
        <ul className="unstyled list-inline clearfix left-nav d-flex align-items-center mb-0">
          <li className="list-inline-item me-3">
            <Link to="/host-dashboard">Airbnb your home</Link>
          </li>
          <li className="list-inline-item">
            <img src={langIcon} alt="Lang" />
          </li>
        </ul>

        {/* Dropdown */}
        <div className="dropdown">
          <button
            className="btn dropdown-toggle d-flex align-items-center"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <div className="hamburger me-2 d-flex flex-column justify-content-between">
              <span
                style={{ height: "2px", width: "20px", background: "#000" }}
              ></span>
              <span
                style={{ height: "2px", width: "20px", background: "#000" }}
              ></span>
              <span
                style={{ height: "2px", width: "20px", background: "#000" }}
              ></span>
            </div>
            <img src={userIcon} alt="User" />
          </button>

          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <Link className="dropdown-item" to="/register">
                Signup
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/login">
                Login
              </Link>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li className="list-inline-item me-3">
              <Link
                to="/host-dashboard"
                style={{
                  color: "black",
                  textDecoration: "none",
                  fontSize: "13px",
                  marginLeft: "20px",
                }}
              >
                Airbnb your home
              </Link>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Help
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
