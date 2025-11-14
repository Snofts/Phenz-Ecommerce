import { useEffect, useState } from "react";
import axios from "axios";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Order from "./pages/Order";
import { ToastContainer } from "react-toastify";
import { Update } from "./pages/Update";

export const currency = "₦";
export const backendUrl = import.meta.env.VITE_BACKEND_URL;

// AXIOS INSTANCE — PURE BEARER TOKEN
const api = axios.create({
  baseURL: backendUrl,
  headers: { "Content-Type": "application/json" },
});

// AUTO ADD BEARER TOKEN
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("phenzAdminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const verifyAdmin = async () => {
    const token = localStorage.getItem("phenzAdminToken");
    if (!token) {
      setAuthChecked(true);
      return;
    }

    try {
      const res = await api.get("/api/user/check-auth");
      if (res.data.success) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("phenzAdminToken");
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Admin verify failed:", error);
      localStorage.removeItem("phenzAdminToken");
      setIsAuthenticated(false);
    } finally {
      setAuthChecked(true);
    }
  };

  useEffect(() => {
    verifyAdmin();
    // localStorage.setItem("phenzAdminToken", );
  }, []);

  
  if (!authChecked) {
    return (
      <div className="flex justify-center items-center h-screen">
        Checking authentication...
      </div>
    );
  }

  return (
    <>
      <ToastContainer />

      {isAuthenticated ? (
        <>
          <Navbar setIsAuthenticated={setIsAuthenticated} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vh, 25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/add" element={<Add />} />
                <Route path="/list" element={<List />} />
                <Route path="/orders" element={<Order />} />
                <Route path="/update" element={<Update />} />
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <Login setIsAuthenticated={setIsAuthenticated} />
      )}
    </>
  );
};

export default App;
