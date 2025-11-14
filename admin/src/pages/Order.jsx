import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { currency } from "./../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

// AXIOS INSTANCE — PURE BEARER (SAME AS EVERYWHERE)
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: { "Content-Type": "application/json" },
});

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

const statusColors = {
  "Order Placed": "bg-blue-100 text-blue-800",
  Packing: "bg-yellow-100 text-yellow-800",
  Shipped: "bg-purple-100 text-purple-800",
  "Out for delivery": "bg-orange-100 text-orange-800",
  Delivered: "bg-green-100 text-green-800",
};

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [updating, setUpdating] = useState(null);

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const response = await api.post("/api/order/list");
      console.log(response);
      if (response.data.success) {
        console.log(response);
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    setUpdating(orderId);
    try {
      const response = await api.post("/api/order/status", {
        orderId,
        status: newStatus,
      });
      if (response.data.success) {
        toast.success(`Order #${orderId.slice(-6)} → ${newStatus}`);
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

// FILTER ORDERS
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "All" || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin h-12 w-12 border-4 border-black border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl text-gray-400 font-bold">No orders yet</p>
        <p className="text-gray-500 mt-4 text-lg">Your empire is growing...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          All Orders ({filteredOrders.length})
        </h1>

        <div className="flex gap-4 w-100% md:w-auto">
          <input
            type="text"
            placeholder="Search by ID, name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-black w-full md:w-96"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-6 py-3 border border-gray-300 rounded-full focus:outline-none"
          >
            <option value="All">All Status</option>
            <option value="Order Placed">Order Placed</option>
            <option value="Packing">Packing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for delivery">Out for delivery</option>
            <option value="Delivered">Delivered</option>
          </select>

          <button
            onClick={fetchAllOrders}
            className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* ORDERS LIST */}
      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition"
          >
            <div className="grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-6 items-start">
              {/* PARCEL ICON */}
              <div className="flex justify-center">
                <img src={assets.parcel_icon} alt="Parcel" className="w-100%" />
              </div>

              {/* ORDER DETAILS */}
              <div>
                <div className="font-bold text-lg mb-2">
                  Order #{order._id.slice(-6).toUpperCase()}
                </div>

                <div className="space-y-1 text-sm">
                  {order.items.map((item, idx) => (
                    <p key={idx}>
                      <span className="font-medium">{item.name}</span> × {item.quantity}{" "}
                      <span className="text-gray-500">({item.size})</span>
                      {idx < order.items.length - 1 && " •"}
                    </p>
                  ))}
                </div>

                <div className="mt-4 space-y-1">
                  <p className="font-bold text-lg">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p className="text-gray-600">{order.address.street}</p>
                  <p className="text-gray-600">
                    {order.address.city}, {order.address.state} {order.address.zipcode}
                  </p>
                  <p className="text-gray-600">{order.address.phone}</p>
                  {order.address.email && (
                    <p className="text-blue-600 text-sm">{order.address.email}</p>
                  )}
                </div>
              </div>

              {/* ORDER INFO */}
              <div className="space-y-3 text-sm">
                <p>
                  <span className="font-bold">Items:</span> {order.items.length}
                </p>
                <p>
                  <span className="font-bold">Method:</span> {order.paymentMethod}
                </p>
                <p>
                  <span className="font-bold">Payment:</span>{" "}
                  <span className={order.payment ? "text-green-600" : "text-red-600"}>
                    {order.payment ? "Paid" : "Pending"}
                  </span>
                </p>
                <p>
                  <span className="font-bold">Date:</span>{" "}
                  {new Date(order.date).toLocaleDateString("en-GB")}
                </p>
              </div>

              {/* AMOUNT */}
              <div className="text-right">
                <p className="text-3xl font-bold text-green-600">
                  {currency}
                  {order.amount.toLocaleString()}
                </p>
              </div>

              {/* STATUS */}
              <div className="flex flex-col gap-3">
                <select
                  onChange={(e) => statusHandler(e, order._id)}
                  value={order.status}
                  disabled={updating === order._id}
                  className={`px-6 py-3 rounded-full font-bold text-center transition ${
                    statusColors[order.status] || "bg-gray-200"
                  } ${updating === order._id ? "opacity-70" : "cursor-pointer"}`}
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
