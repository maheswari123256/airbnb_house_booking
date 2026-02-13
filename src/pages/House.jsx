import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import HouseCard from "../components/HouseCard";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";

const House = () => {
  const [houses, setHouses] = useState([]);
  const [wishlistItems, setWishlistItems] = useState(
    JSON.parse(localStorage.getItem("wishlist") || "[]")
  );

  useEffect(() => {
    loadHouseTypes();
    fetchHouses();
  }, []);

  const toggleWishlist = (houseId) => {
    let updatedWishlist = [...wishlistItems];
    if (updatedWishlist.includes(houseId)) {
      updatedWishlist = updatedWishlist.filter(id => id !== houseId);
    } else {
      updatedWishlist.push(houseId);
    }
    setWishlistItems(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  const loadHouseTypes = async () => {
    try {
     const res = await fetch(
  `${import.meta.env.VITE_API_URL}/api/admin/house-types`,
  {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") }
  }
);

      const data = await res.json();

      const container = document.getElementById("houseTypeContainer");
      container.innerHTML = "";

      data.forEach(type => {
        const slide = document.createElement("div");
        slide.className = "swiper-slide category-slide";

        slide.innerHTML = `
          <a href="/housecategory?typeId=${type._id}" class="category-item">
            <img src="${type.icon}" alt="${type.name}" />
            <span>${type.name}</span>
          </a>
        `;

        container.appendChild(slide);
      });

     setTimeout(() => {
  new Swiper(".mySwiper", {
    slidesPerView: "auto",
    spaceBetween: 28,
    freeMode: true,
    grabCursor: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    }
  });
}, 0);


    } catch (err) {
      console.error(err);
    }
  };

  const fetchHouses = async () => {
    try {
     const res = await fetch(
  `${import.meta.env.VITE_API_URL}/api/house`,
  {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  }
);

      const data = await res.json();
      setHouses(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Header />

      {/* ===== CATEGORY SWIPER ===== */}
      <div className="own-container category-wrapper">
        <div className="swiper mySwiper">
          <div className="swiper-wrapper" id="houseTypeContainer"></div>
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </div>
      </div>

      {/* ===== HOUSE LIST ===== */}
      <div id="houseList" className="card-grid">
        {houses.length === 0
          ? "Loading..."
          : houses.map(h => (
              <HouseCard
                key={h._id}
                house={h}
                wishlistItems={wishlistItems}
                toggleWishlist={toggleWishlist}
              />
            ))}
      </div>
    </>
  );
};

export default House;
