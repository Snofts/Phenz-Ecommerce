import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const NewsletterBox = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/newsletter/subscribe`,
        { email }
      );

      if (response.data.success) {
        toast.success("Subscribed");
        setEmail("");
      } else {
        toast.warn(response.data.message);
      }
    } catch (error) {
      toast.error("Failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <p className="text-2xl font-medium text-gray-800">Subscribe now</p>
      <p className="text-gray-400 mt-3">
        Be the first to hear about our latest gist and fashion trend.
      </p>
      <form
        onSubmit={onSubmitHandler}
        className="w-ful sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full sm:flex-1 outline-none"
          required
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white text-xs px-10 py-4"
        >
          {loading ? "Joining..." : "SUBSCRIBE"}
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;
