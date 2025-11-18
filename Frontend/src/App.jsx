import React, { useContext, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer, toast } from "react-toastify";
import Verify from "./pages/Verify";
import Delivery from "./pages/Delivery";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { ShopContext } from "../src/context/ShopContext";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};

const App = () => {
  const { visible } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // SHOW LOADER ON ROUTE CHANGE
  useEffect(() => {
    setLoading(true);

    // Small delay to ensure page transition feels smooth
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600); // Adjust time if needed (400–800ms is perfect)

    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden"; // disable scroll
    } else {
      document.body.style.overflow = "auto"; // enable scroll again
    }

    // Cleanup (important)
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [visible]);

  // FULL PAGE LOADER
  if (loading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-6 text-lg font-medium text-gray-700">Loading PHENZ...</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <ScrollToTop />
      <Navbar />
      <SearchBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/policy" element={<PrivacyPolicy />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
