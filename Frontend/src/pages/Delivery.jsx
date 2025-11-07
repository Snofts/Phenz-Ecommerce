// src/pages/Delivery.jsx
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";

const REGIONS = {
  southwest: {
    name: "South West",
    states: ["Lagos", "Ogun", "Oyo", "Osun", "Ondo", "Ekiti"],
    standard: { fee: 500, days: "1-2 days" },
    express: { fee: 1200, days: "Same day (Lagos) / Next day" },
    pickup: true,
  },
  southeast: {
    name: "South East",
    states: ["Abia", "Anambra", "Ebonyi", "Enugu", "Imo"],
    standard: { fee: 800, days: "2-3 days" },
    express: { fee: 1800, days: "1-2 days" },
  },
  southsouth: {
    name: "South South",
    states: ["Akwa Ibom", "Bayelsa", "Cross River", "Delta", "Edo", "Rivers"],
    standard: { fee: 900, days: "2-4 days" },
    express: { fee: 2000, days: "1-3 days" },
  },
  northcentral: {
    name: "North Central",
    states: ["Benue", "Kogi", "Kwara", "Nasarawa", "Niger", "Plateau", "FCT"],
    standard: { fee: 1000, days: "3-5 days" },
    express: { fee: 2200, days: "2-3 days" },
  },
  northwest: {
    name: "North West",
    states: ["Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Sokoto", "Zamfara"],
    standard: { fee: 1200, days: "4-6 days" },
    express: { fee: 2500, days: "2-4 days" },
  },
  northeast: {
    name: "North East",
    states: ["Adamawa", "Bauchi", "Borno", "Gombe", "Taraba", "Yobe"],
    standard: { fee: 1500, days: "5-7 days" },
    express: { fee: 3000, days: "3-5 days" },
  },
};

const Delivery = () => {
  const { currency } = useContext(ShopContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [regionData, setRegionData] = useState(null);

  // All states for search
  const allStates = Object.values(REGIONS)
    .flatMap(r => r.states.map(s => ({ name: s, region: r })))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Filter states as user types
  const filteredStates = searchQuery
    ? allStates.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleStateClick = (state) => {
    setSelectedState(state.name);
    setSearchQuery("");
    setRegionData(state.region);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Delivery Across Nigeria</h1>
          <p className="text-xl text-gray-600">Search your state to see shipping rates</p>
        </div>

        {/* Hero Banner */}
        <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={assets.delivery_banner}
            alt="Phenz Delivery"
            className="w-full h-96 object-cover"
          />
        </div>

        {/* Search Box */}
        <div className="relative max-w-2xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-200">
            <div className="flex items-center gap-3">
              <span className="text-3xl">Search</span>
              <input
                type="text"
                placeholder="Type your state (e.g. Lagos, Kano, Enugu...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-lg px-4 py-3 border-0 focus:outline-none"
                autoFocus
              />
            </div>

            {/* Dropdown Results */}
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border-2 border-gray-200 max-h-64 overflow-y-auto z-10">
                {filteredStates.length > 0 ? (
                  filteredStates.map((state, i) => (
                    <div
                      key={i}
                      onClick={() => handleStateClick(state)}
                      className="px-6 py-4 hover:bg-green-50 cursor-pointer border-b last:border-b-0 flex justify-between"
                    >
                      <span className="font-medium">{state.name}</span>
                      <span className="text-sm text-gray-500">
                        {state.region.standard.fee === 500 ? "Fast" : state.region.standard.fee < 1000 ? "Standard" : "Remote"}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No state found. Try "Lagos", "Kano", "Enugu"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Selected State Pricing */}
        {selectedState && regionData && (
          <div className="bg-white rounded-3xl shadow-2xl p-10 mb-20 animate-fadeIn">
            <h2 className="text-4xl font-bold text-center mb-10">
              Delivery to <span className="text-green-600">{selectedState}</span>
              <span className="block text-lg font-normal text-gray-600 mt-2">
                {regionData.name} Region
              </span>
            </h2>

            <div className="grid md:grid-cols-3 gap-10">
              {/* Standard */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 text-center shadow-lg transform hover:scale-105 transition">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">Truck</span>
                </div>
                <h3 className="text-2xl font-bold mb-3">Standard Delivery</h3>
                <p className="text-4xl font-extrabold text-green-600 mb-2">
                  {currency}{regionData.standard.fee.toLocaleString()}
                </p>
                <p className="text-lg text-gray-700">{regionData.standard.days}</p>
              </div>

              {/* Express */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center shadow-lg border-4 border-blue-500 relative transform hover:scale-105 transition">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    RECOMMENDED
                  </span>
                </div>
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">Lightning</span>
                </div>
                <h3 className="text-2xl font-bold mb-3">Express Delivery</h3>
                <p className="text-4xl font-extrabold text-blue-600 mb-2">
                  {currency}{regionData.express.fee.toLocaleString()}
                </p>
                <p className="text-lg text-gray-700">{regionData.express.days}</p>
              </div>

              {/* Pickup */}
              {regionData.pickup && (
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center shadow-lg transform hover:scale-105 transition">
                  <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">Package</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Store Pickup</h3>
                  <p className="text-4xl font-extrabold text-purple-600 mb-2">FREE</p>
                  <p className="text-lg text-gray-700">Ready in 2 days</p>
                  <p className="text-sm text-purple-600 font-medium">Lagos Island Store</p>
                </div>
              )}
            </div>

            <div className="mt-10 text-center">
              <p className="text-gray-600 text-lg">
                Other states in this region: <span className="font-medium">{regionData.states.join(" • ")}</span>
              </p>
            </div>
          </div>
        )}

        {/* Nationwide Badge */}
        <div className="text-center mb-20">
          <div className="inline-block bg-gradient-to-r from-green-500 to-blue-600 text-white px-12 py-6 rounded-full text-2xl font-bold shadow-2xl">
            We Deliver to All 36 States + FCT
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/collection"
            className="inline-block bg-black text-white px-12 py-5 rounded-full text-2xl font-bold hover:bg-gray-800 transition transform hover:scale-110 shadow-2xl"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Delivery;