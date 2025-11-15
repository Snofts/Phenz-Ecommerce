import React, { useEffect, useState } from "react";
import axios from "axios";
import { currency } from "./../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

// AXIOS INSTANCE
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("phenzAdminToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
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
      const { data } = await api.post("/api/order/list");
      if (data.success) {
        setOrders(data.orders.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (e, orderId) => {
    const newStatus = e.target.value;
    setUpdating(orderId);
    try {
      const { data } = await api.post("/api/order/status", {
        orderId,
        status: newStatus,
      });
      if (data.success) {
        toast.success(`Order #${orderId.slice(-6)} → ${newStatus}`);
        await fetchAllOrders();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // FILTER LOGIC
  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      order._id.toLowerCase().includes(search) ||
      `${order.address.firstName} ${order.address.lastName}`
        .toLowerCase()
        .includes(search) ||
      order.address.email?.toLowerCase().includes(search);

    const matchesStatus = filterStatus === "All" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // LOADING STATE
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin h-12 w-12 border-4 border-black border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // EMPTY STATE
  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl text-gray-400 font-bold">No orders yet</p>
        <p className="text-gray-500 mt-4 text-lg">Your empire is growing...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            All Orders ({filteredOrders.length})
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by ID, name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-black w-full"
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none"
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
              className="px-4 py-2 bg-black text-white text-sm hover:bg-gray-800 transition whitespace-nowrap"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* ORDERS LIST */}
      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-4 md:p-6 border border-gray-200"
          >
            {/* MOBILE: Vertical Stack | DESKTOP: Grid */}
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] lg:grid-cols-[auto_2fr_1fr_1fr_auto] gap-4 md:gap-6 items-start">
              {/* ICON */}
              <div className="flex justify-center md:justify-start">
                <img
                  src={assets.parcel_icon}
                  alt="Parcel"
                  className="w-12 h-12 md:w-16 md:h-16 object-contain"
                />
              </div>

              {/* ORDER DETAILS */}
              <div className="space-y-3">
                <div className="font-bold text-lg text-gray-800">
                  #{order._id.slice(-6).toUpperCase()}
                </div>

                {/* Items */}
                <div className="text-sm text-gray-700 space-y-1">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex flex-wrap items-center gap-1">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-500">
                        × {item.quantity} ({item.size})
                      </span>
                      {i < order.items.length - 1 && (
                        <span className="text-gray-400 mx-1">•</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Address */}
                <div className="text-sm space-y-1 mt-3">
                  <p className="font-bold text-base">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p className="text-gray-600">{order.address.street}</p>
                  <p className="text-gray-600">
                    {order.address.city}, {order.address.state}{" "}
                    {order.address.zipcode}
                  </p>
                  <p className="text-gray-600">{order.address.phone}</p>
                  {order.address.email && (
                    <p className="text-blue-600 text-xs">{order.address.email}</p>
                  )}
                </div>
              </div>

              {/* ORDER INFO (Hidden on mobile, shown on md+) */}
              <div className="hidden lg:block space-y-2 text-sm">
                <p>
                  <span className="font-bold">Items:</span> {order.items.length}
                </p>
                <p>
                  <span className="font-bold">Method:</span> {order.paymentMethod}
                </p>
                <p>
                  <span className="font-bold">Payment:</span>{" "}
                  <span
                    className={order.payment ? "text-green-600" : "text-red-600"}
                  >
                    {order.payment ? "Paid" : "Pending"}
                  </span>
                </p>
                <p>
                  <span className="font-bold">Date:</span>{" "}
                  {new Date(order.date).toLocaleDateString("en-GB")}
                </p>
              </div>

              {/* AMOUNT */}
              <div className="text-right md:text-left lg:text-right">
                <p className="text-2xl md:text-3xl font-bold text-green-600">
                  {currency}
                  {order.amount.toLocaleString()}
                </p>
              </div>

              {/* STATUS */}
              <div className="flex justify-end md:justify-center lg:justify-end">
                <select
                  onChange={(e) => statusHandler(e, order._id)}
                  value={order.status}
                  disabled={updating === order._id}
                  className={`px-4 py-2 rounded-full font-bold text-center text-xs md:text-sm transition min-w-[140px] ${
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

            {/* MOBILE-ONLY: Collapsed Order Info */}
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 text-xs space-y-1 text-gray-600">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;