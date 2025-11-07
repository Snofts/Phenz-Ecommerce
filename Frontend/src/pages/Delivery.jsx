// src/pages/Delivery.jsx
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";

const DELIVERY_RATES = {
  ibadan: { fee: 1000, days: "1-2 days", message: "Special Ibadan Rate!" },
  southwest: { fee: 2000, days: "2-3 days" },
  southeast: { fee: 2500, days: "3-4 days" },
  southsouth: { fee: 2800, days: "3-5 days" },
  northcentral: { fee: 3000, days: "4-6 days" },
  northwest: { fee: 3500, days: "5-7 days" },
  northeast: { fee: 4000, days: "6-8 days" },
};

const REGIONS = {
  southwest: { name: "South West", states: ["Lagos", "Ogun", "Oyo", "Osun", "Ondo", "Ekiti"] },
  southeast: { name: "South East", states: ["Abia", "Anambra", "Ebonyi", "Enugu", "Imo"] },
  southsouth: { name: "South South", states: ["Akwa Ibom", "Bayelsa", "Cross River", "Delta", "Edo", "Rivers"] },
  northcentral: { name: "North Central", states: ["Benue", "Kogi", "Kwara", "Nasarawa", "Niger", "Plateau", "FCT"] },
  northwest: { name: "North West", states: ["Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Sokoto", "Zamfara"] },
  northeast: { name: "North East", states: ["Adamawa", "Bauchi", "Borno", "Gombe", "Taraba", "Yobe"] },
};

const Delivery = () => {
  const { currency } = useContext(ShopContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  const allLocations = [
    { name: "Ibadan", region: "ibadan", special: true },
    ...Object.entries(REGIONS).flatMap(([key, region]) =>
      region.states.map(state => ({ name: state, region: key }))
    )
  ].sort((a, b) => a.name.localeCompare(b.name));

  const filteredLocations = searchQuery
    ? allLocations.filter(loc => loc.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleLocationClick = (loc) => {
    setSelectedState(loc.name);
    setSearchQuery("");
    if (loc.special) {
      setDeliveryInfo({ ...DELIVERY_RATES.ibadan, name: loc.name, region: "Ibadan" });
    } else {
      const regionData = REGIONS[loc.region];
      setDeliveryInfo({
        ...DELIVERY_RATES[loc.region],
        name: loc.name,
        region: regionData.name
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-black mb-3">
            Doorstep Delivery Nationwide
          </h1>
          <p className="text-lg text-gray-600">
            Pay before Delivery • Full Tracking
          </p>
        </div>

        {/* Hero */}
        <div className="mb-12 rounded-2xl overflow-hidden shadow-xl border border-gray-200">
          <img
            src={assets.delivery_banner || "https://res.cloudinary.com/dh9hpr60s/image/upload/v1762519870/delivery-phenz.jpg"}
            alt="Phenz Delivery"
            className="w-full h-64 sm:h-80 object-cover"
          />
        </div>

        {/* Search Box */}
        <div className="relative mb-8">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-5 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <span className="text-3xl hidden sm:block">Search</span>
              <div className="w-full">
                <input
                  type="text"
                  placeholder="Search your city/state (e.g. Ibadan, Lagos, Abuja...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none transition"
                  autoFocus
                />
              </div>
            </div>

            {/* SIMPLE IBADAN TEXT UNDER SEARCH BAR */}
            <div className="mt-6 text-center">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                <span className="font-bold text-black">Good news for Ibadan!</span> 
                {" "}Enjoy <span className="text-gold font-bold text-lg">₦1,000 flat delivery fee</span> — 
                no matter your location within the city. Fast, reliable, doorstep delivery in 1-2 days.
              </p>
            </div>

            {/* Dropdown */}
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 max-h-64 overflow-y-auto z-20">
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((loc, i) => (
                    <div
                      key={i}
                      onClick={() => handleLocationClick(loc)}
                      className={`px-6 py-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex items-center justify-between ${
                        loc.special ? "bg-yellow-50 hover:bg-yellow-100" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{loc.name}</span>
                        {loc.special && (
                          <span className="bg-black text-white text-xs px-3 py-1 rounded-full font-bold">
                            ₦1,000 FLAT
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {loc.special ? "Ibadan Special" : REGIONS[loc.region]?.name}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No location found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Delivery Result */}
        {deliveryInfo && (
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 p-8 sm:p-12 mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-2">
                Delivery to {deliveryInfo.name}
              </h2>
              {deliveryInfo.name === "Ibadan" ? (
                <p className="text-2xl font-bold text-gold">₦1,000 Special Rate Applied!</p>
              ) : (
                <p className="text-lg text-gray-600">{deliveryInfo.region} Region</p>
              )}
            </div>

            <div className="bg-black text-white rounded-3xl p-10 text-center">
              <div className="mb-6">
                <span className="text-5xl sm:text-6xl">Door</span>
                <h3 className="text-2xl sm:text-3xl font-bold mt-3">
                  Doorstep Delivery
                </h3>
              </div>

              <div className="text-5xl sm:text-6xl font-bold mb-4 text-gold">
                {currency}{deliveryInfo.fee.toLocaleString()}
              </div>

              <p className="text-xl">
                Arrives in <span className="font-bold">{deliveryInfo.days}</span>
              </p>
            </div>

            <div className="mt-8 text-center text-sm text-gray-600 space-y-1">
              <p>Full tracking • Insurance • Cash on Delivery</p>
            </div>
          </div>
        )}

        {/* Nationwide */}
        <div className="text-center mb-16">
          <div className="inline-block bg-black text-white px-10 py-5 rounded-full text-xl sm:text-2xl font-bold shadow-xl">
            Doorstep to All 36 States + FCT
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/collection"
            className="inline-block bg-black text-white px-12 py-5 rounded-full text-xl font-bold hover:bg-gray-800 transition transform hover:scale-105 shadow-xl"
          >
            Start Shopping
          </Link>
        </div>
      </div>

      {/* Gold Color */}
      <style jsx>{`
        .text-gold { color: #d4af37; }
        .bg-gold { background-color: #d4af37; }
      `}</style>
    </div>
  );
};

export default Delivery;