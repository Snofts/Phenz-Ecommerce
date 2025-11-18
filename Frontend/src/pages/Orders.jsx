import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";

const statusStyles = {
  "Order Placed": "bg-blue-500",
  Packing: "bg-yellow-500",
  Shipped: "bg-purple-500",
  "Out for delivery": "bg-orange-500",
  Delivered: "bg-green-500",
  Cancelled: "bg-red-600",
};

const ORDERS_PER_PAGE = 10;

const Orders = () => {
  const { backendUrl, token, currency, api, deliveryFee } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await api.post("/api/order/userOrders");
      if (response.data.success) {
        let allOrdersItems = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item.status = order.status;
            item.payment = order.payment;
            item.paymentMethod = order.paymentMethod;
            item.date = order.date;
            item.orderId = order._id; // optional: for tracking
            allOrdersItems.push(item);
          });
        });
        setOrderData(allOrdersItems.reverse());
        setCurrentPage(1); // reset to first page
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  // PAGINATION LOGIC
  const totalPages = Math.ceil(orderData.length / ORDERS_PER_PAGE);
  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
  const endIndex = startIndex + ORDERS_PER_PAGE;
  const currentOrders = orderData.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="border-t pt-16 min-h-screen">
      <div className="text-2xl mb-8">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      {/* ORDERS LIST */}
      <div className="space-y-4">
        {currentOrders.length === 0 ? (
          <p className="text-center text-gray-500 py-20 text-lg">
            {orderData.length === 0 ? "No orders yet" : "No more orders"}
          </p>
        ) : (
          currentOrders.map((item, index) => (
            <div
              key={index}
              className="py-6 border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white transition-shadow"
            >
              <div className="flex items-start gap-6 text-sm">
                <img className="w-20 sm:w-24 rounded-lg" src={item.image[0]} alt={item.name} />
                <div className="flex-1">
                  <p className="text-lg font-semibold text-gray-900">{item.name}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-600">
                    <p className="font-medium">
                      {currency}{(item.price + deliveryFee).toLocaleString()}
                    </p>
                    <p>Qty: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    <p>
                      DATE: <span className="text-gray-500">{new Date(item.date).toDateString()}</span>
                    </p>
                    <p>
                      PAYMENT: <span className="text-gray-500">{item.paymentMethod}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${statusStyles[item.status] || "bg-gray-500"}`} />
                  <span className="font-medium text-gray-800">{item.status}</span>
                </div>
                <button
                  onClick={loadOrderData}
                  className="border border-black px-5 py-2 text-sm font-medium hover:bg-black hover:text-white transition whitespace-nowrap"
                >
                  Track Order
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12 pb-10">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            ← Previous
          </button>

          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`px-2 py-1 rounded-lg transition ${
                  currentPage === i + 1
                    ? "bg-black text-white"
                    : "border hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            Next →
          </button>
        </div>
      )}

      {/* SHOWING INFO */}
      {orderData.length > 0 && (
        <p className="text-center text-gray-500 text-sm mt-4">
          Showing {startIndex + 1}–{Math.min(endIndex, orderData.length)} of {orderData.length} orders
        </p>
      )}
    </div>
  );
};

export default Orders;