import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Verify = () => {
  const { backendUrl, token, setCartItems } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [verifying, setVerifying] = useState(true);

  // Paystack (and Stripe) redirect with: ?success=1&orderId=...
  const success = searchParams.get("success") === "1";
  const orderId = searchParams.get("orderId");

  const verifyPayment = async () => {
    if (!token || !orderId) {
      toast.error("Invalid payment link");
      setVerifying(false);
      navigate("/cart");
      return;
    }

    try {
      // Choose endpoint based on success param or URL pattern
      const endpoint = success
        ? "/api/order/verifyPaystack"   // or /verifyStripe
        : "/api/order/verifyPaystack";  // failed payments still hit same

      const { data } = await axios.post(
        `${backendUrl}${endpoint}`,
        { orderId, success },
        { headers: { token } }
      );

      if (data.success) {
        setCartItems({});
        toast.success("Payment verified! Order placed.");
        navigate("/orders");
      } else {
        toast.error(data.message || "Payment failed");
        navigate("/cart");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error(error.response?.data?.message || "Verification failed");
      navigate("/cart");
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    verifyPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, orderId, success]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        {verifying ? (
          <>
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent mb-4"></div>
            <p className="text-xl font-medium">Verifying your payment...</p>
          </>
        ) : (
          <p className="text-lg">Redirecting...</p>
        )}
      </div>
    </div>
  );
};

export default Verify;