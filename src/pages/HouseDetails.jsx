import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "../styles/HouseDetails.css";

const HouseDetails = () => {
  const { houseId } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [house, setHouse] = useState(null);
  const [availabilityMsg, setAvailabilityMsg] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState("—");
  const [eligibleBookingId, setEligibleBookingId] = useState(null);

  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const checkInRef = useRef();
  const checkOutRef = useRef();
  const checkInPicker = useRef();
  const checkOutPicker = useRef();

  const API = import.meta.env.VITE_API_URL; // ✅ For image URLs fallback

  // ---------------- AUTH ----------------
  useEffect(() => {
    if (!token) {
      alert("❌ Please login first");
      navigate("/login");
    }
  }, [token, navigate]);

  // ---------------- FLATPICKR ----------------
  useEffect(() => {
    if (!checkInRef.current || !checkOutRef.current) return;

    checkOutPicker.current = flatpickr(checkOutRef.current, {
      dateFormat: "Y-m-d",
      minDate: new Date().fp_incr(1),
    });

    checkInPicker.current = flatpickr(checkInRef.current, {
      minDate: "today",
      dateFormat: "Y-m-d",
      onChange: (selectedDates) => {
        if (selectedDates.length && checkOutPicker.current) {
          const minCheckout = new Date(selectedDates[0]);
          minCheckout.setDate(minCheckout.getDate() + 1);
          checkOutPicker.current.set("minDate", minCheckout);
        }
      },
    });

    return () => {
      checkInPicker.current?.destroy();
      checkOutPicker.current?.destroy();
    };
  }, [house]);

  // ---------------- LOAD HOUSE ----------------
  useEffect(() => {
    const loadHouse = async () => {
      try {
        const res = await fetch(`${API}/api/house/${houseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setHouse(data);
      } catch (err) {
        console.error("Error loading house:", err);
      }
    };
    loadHouse();
  }, [houseId, token, API]);

  // ---------------- GUESTS ----------------
  const updateGuest = (type, delta) => {
    setGuests((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta),
    }));
  };

  // ---------------- AVAILABILITY ----------------
  const checkAvailability = async () => {
    try {
      const from = new Date(checkInRef.current.value).toISOString();
      const to = new Date(checkOutRef.current.value).toISOString();

      const res = await fetch(
        `${API}/api/house/${houseId}/check?from=${from}&to=${to}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setAvailabilityMsg(
        data.available
          ? "✅ Available! You can proceed to book."
          : `❌ Not Available: ${data.reason}`
      );
    } catch (err) {
      console.error("Availability error:", err);
      setAvailabilityMsg("❌ Could not check availability");
    }
  };

  // ---------------- BOOKING ----------------
  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/api/booking/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          houseId,
          checkIn: checkInRef.current.value,
          checkOut: checkOutRef.current.value,
          guests,
        }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      const options = {
        key: "rzp_test_FDd41HKKDTunDa",
        amount: data.amount,
        currency: "INR",
        order_id: data.orderId,
        handler: (response) => verifyPayment(response, data.bookingId),
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Booking error:", err);
      alert("Booking failed");
    }
  };

  const verifyPayment = async (response, bookingId) => {
    try {
      const res = await fetch(`${API}/api/booking/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        }),
      });

      if (res.ok) {
        setBookingMessage("✅ Booking Confirmed!");
        checkEligibility();
        loadReviews();
      }
    } catch (err) {
      console.error("Payment verification error:", err);
    }
  };

  // ---------------- REVIEWS ----------------
  const loadReviews = async () => {
    try {
      const res = await fetch(`${API}/api/reviews/house/${houseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setReviews(data.reviews || []);
      setAvgRating(data.avgRating?.toFixed(2) || "—");
    } catch (err) {
      console.error("Load reviews error:", err);
    }
  };

  const checkEligibility = async () => {
    try {
      const res = await fetch(`${API}/api/reviews/eligible/${houseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.eligible) setEligibleBookingId(data.bookingId);
    } catch (err) {
      console.error("Eligibility check error:", err);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    const rating = e.target.rating.value;
    const comment = e.target.comment.value;

    try {
      const res = await fetch(`${API}/api/reviews/${eligibleBookingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (res.ok) {
        loadReviews();
        setEligibleBookingId(null);
      }
    } catch (err) {
      console.error("Submit review error:", err);
    }
  };

  if (!house) return <p>Loading...</p>;

  return (
    <div className="house-details-page">
      <h1>{house.title}</h1>
      <p>{house.description}</p>

      <div className="house-info">
        <p>📍 {house.location}</p>
        <p>₹{house.pricePerNight} / night</p>
      </div>

      <div className="house-images">
        {house.images?.flatMap(i => i.urls).map((url, i) => (
          <img
            key={i}
            src={url?.startsWith("http") ? url : `${API}/${url}`}
            alt=""
          />
        ))}
      </div>

      <form className="booking-form" onSubmit={handleBooking}>
        <div className="date-container">
          <div className="date-input-wrapper">
            <input ref={checkInRef} className="date-input" placeholder="Check-in" readOnly />
          </div>
          <div className="date-input-wrapper">
            <input ref={checkOutRef} className="date-input" placeholder="Check-out" readOnly />
          </div>
        </div>

        <div className="guest-box">
          {["adults", "children", "infants", "pets"].map(g => (
            <div className="guest-row" key={g}>
              <span>{g}</span>
              <button type="button" onClick={() => updateGuest(g, -1)}>-</button>
              <span>{guests[g]}</span>
              <button type="button" onClick={() => updateGuest(g, 1)}>+</button>
            </div>
          ))}
        </div>

        <button type="button" className="primary-btn" onClick={checkAvailability}>
          Check Availability
        </button>

        <p>{availabilityMsg}</p>

        <button type="submit" className="primary-btn">
          Book & Pay
        </button>

        <p className="booking-message">{bookingMessage}</p>
      </form>

      <h2>⭐ {avgRating}</h2>

      {reviews.map((r, i) => (
        <div key={i}>
          <strong>{r.userId?.name}</strong> – ⭐ {r.rating}
          <p>{r.comment}</p>
        </div>
      ))}

      {eligibleBookingId && (
        <form onSubmit={submitReview}>
          <select name="rating">{[5,4,3,2,1].map(n => <option key={n}>{n}</option>)}</select>
          <textarea name="comment" required />
          <button className="primary-btn">Submit Review</button>
        </form>
      )}
    </div>
  );
};

export default HouseDetails;
