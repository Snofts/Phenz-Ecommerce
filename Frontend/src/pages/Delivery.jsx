// src/pages/Delivery.jsx
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";

// const DELIVERY_RATES = {
//   ibadan: { fee: 1000, days: "1-2 days", message: "Special Ibadan Rate!" },
//   southwest: { fee: 5000, days: "2-3 days" },
//   southeast: { fee: 5000, days: "3-4 days" },
//   southsouth: { fee: 2800, days: "3-5 days" },
//   northcentral: { fee: 3000, days: "4-6 days" },
//   northwest: { fee: 3500, days: "5-7 days" },
//   northeast: { fee: 4000, days: "6-8 days" },
// };

// const REGIONS = {
//   southwest: {
//     name: "South West",
//     states: ["Lagos", "Ogun", "Oyo", "Osun", "Ondo", "Ekiti"],
//   },
//   southeast: {
//     name: "South East",
//     states: ["Abia", "Anambra", "Ebonyi", "Enugu", "Imo"],
//   },
//   southsouth: {
//     name: "South South",
//     states: ["Akwa Ibom", "Bayelsa", "Cross River", "Delta", "Edo", "Rivers"],
//   },
//   northcentral: {
//     name: "North Central",
//     states: ["Benue", "Kogi", "Kwara", "Nasarawa", "Niger", "Plateau", "FCT"],
//   },
//   northwest: {
//     name: "North West",
//     states: ["Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Sokoto", "Zamfara"],
//   },
//   northeast: {
//     name: "North East",
//     states: ["Adamawa", "Bauchi", "Borno", "Gombe", "Taraba", "Yobe"],
//   },
// };

const DELIVERY_RATES = {
  ibadan: { fee: 1000, days: "1-2 days", message: "Special Ibadan Rate!" },
  zone1: { fee: 5000, days: "2-3 days" },
  zone1one2: { fee: 7000, days: "3-4 days" },
  zone3: { fee: 10000, days: "3-5 days" },
};

const REGIONS = {
  zone1: {
    name: "Zone 1",
    states: ["lagos", "ogun", "oyo", "osun", "ondo", "ekiti"],
  },
  zone2: {
    name: "Zone 2",
    states: ["abia", "adamawa", "anambra", "ebonyi", "enugu", "imo", "akwa ibom", "bayelsa", "cross river", "rivers", "delta", "edo"],
  },
  zone3: {
    name: "Zone 3",
    states: ["benue", "kogi", "taraba", "yobe", "gombe", "bauchi", "kwara", "nasarawa", "niger", "bornu", "plateau", "fct", "jigsaw", "kaduna", "kano", "katsina", "kebbi", "sokoto", "zamfara"],
  },
};

const Delivery = () => {
  const { currency } = useContext(ShopContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  const allLocations = [
    { name: "Ibadan", region: "ibadan", special: true },
    ...Object.entries(REGIONS).flatMap(([key, region]) =>
      region.states.map((state) => ({ name: state, region: key }))
    ),
  ].sort((a, b) => a.name.localeCompare(b.name));

  const filteredLocations = searchQuery
    ? allLocations.filter((loc) =>
        loc.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleLocationClick = (loc) => {
    setSelectedState(loc.name);
    setSearchQuery("");
    if (loc.special) {
      setDeliveryInfo({
        ...DELIVERY_RATES.ibadan,
        name: loc.name,
        region: "Ibadan",
      });
    } else {
      const regionData = REGIONS[loc.region];
      setDeliveryInfo({
        ...DELIVERY_RATES[loc.region],
        name: loc.name,
        region: regionData.name,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* === HEADER === */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl text-black mb-2">
            <Title text1="Doorstep" text2="Delivery Nationwide" />
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600">
            Pay before Delivery • Full Tracking
          </p>
        </div>

        {/* === HERO IMAGE === */}
        <div className="mb-10 rounded-2xl overflow-hidden shadow-xl border border-gray-200">
          <img
            src={assets.delivery_banner}
            alt="Phenz Delivery"
            className="w-full h-48 sm:h-64 lg:h-80 object-cover"
          />
        </div>

        {/* === SEARCH BOX === */}
        <div className="relative mb-10">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <span className="text-2xl sm:text-3xl hidden sm:block">Search</span>
              <input
                type="text"
                placeholder="Search by state (e.g. Oyo, Lagos...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none transition"
                autoFocus
              />
            </div>

            {/* Ibadan Special */}
            <div className="mt-5 text-center">
              <p className="text-xs sm:text-sm lg:text-base text-gray-700 leading-relaxed">
                <span className="font-bold text-black">Good news for Ibadan!</span>{" "}
                Enjoy{" "}
                <span className="text-gold font-bold text-base sm:text-lg">
                  ₦1,000 flat delivery fee
                </span>{" "}
                — fast, reliable, doorstep delivery in 1-2 days.
              </p>
            </div>

            {/* DROPDOWN RESULTS */}
            {searchQuery && (
              <div className="absolute inset-x-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 max-h-64 overflow-y-auto z-50">
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((loc, i) => (
                    <div
                      key={i}
                      onClick={() => handleLocationClick(loc)}
                      className={`px-4 py-3 sm:px-6 sm:py-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${
                        loc.special ? "bg-yellow-50 hover:bg-yellow-100" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm sm:text-base">{loc.name}</span>
                        {loc.special && (
                          <span className="bg-black text-white text-xs px-2 py-1 rounded-full font-bold">
                            ₦1,000 FLAT
                          </span>
                        )}
                      </div>
                      <span className="text-xs sm:text-sm text-gray-500">
                        {loc.special ? "Ibadan Special" : REGIONS[loc.region]?.name}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-6 sm:p-8 text-center text-gray-500 text-sm">
                    No location found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* === DELIVERY RESULT === */}
        {deliveryInfo && (
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 p-6 sm:p-8 lg:p-12 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-2">
                Delivery to {deliveryInfo.name}
              </h2>
              {deliveryInfo.name === "Ibadan" ? (
                <p className="text-xl sm:text-2xl font-bold text-gold">
                  ₦1,000 Special Rate!
                </p>
              ) : (
                <p className="text-base sm:text-lg text-gray-600">
                  {deliveryInfo.region} Region
                </p>
              )}
            </div>

            <div className="bg-black text-white rounded-3xl p-8 sm:p-10 text-center">
              <div className="mb-5">
                <span className="text-4xl sm:text-5xl lg:text-6xl">Door</span>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mt-2">
                  Doorstep Delivery
                </h3>
              </div>

              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 text-gold">
                {currency}{deliveryInfo.fee.toLocaleString()}
              </div>

              <p className="text-base sm:text-lg lg:text-xl">
                Arrives in <span className="font-bold">{deliveryInfo.days}</span>
              </p>
            </div>

            <div className="mt-6 text-center text-xs sm:text-sm text-gray-600">
              <p>Full tracking • Insurance included</p>
            </div>
          </div>
        )}

        {/* === NATIONWIDE BADGE === */}
        <div className="text-center mb-12">
          <div className="inline-block bg-black text-white px-6 py-3 sm:px-10 sm:py-5 text-base sm:text-xl lg:text-2xl shadow-xl">
            Doorstep to All 36 States + FCT
          </div>
        </div>

        {/* === CTA BUTTON === */}
        <div className="text-center">
          <Link
            to="/collection"
            className="inline-block bg-black text-white px-8 py-4 sm:px-12 sm:py-5 text-base sm:text-xl hover:bg-gray-800 transition transform hover:scale-105 shadow-xl"
          >
            Start Shopping
          </Link>
        </div>
      </div>

      {/* === GOLD COLOR === */}
      <style jsx>{`
        .text-gold {
          color: #d4af37;
        }
      `}</style>
    </div>
  );
};

export default Delivery;