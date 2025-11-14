import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₦";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  // AXIOS INSTANCE WITH JWT HEADER
  const api = axios.create({
    baseURL: backendUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // AUTO ADD JWT TO EVERY REQUEST
  api.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select product size");
      return;
    }

    let cardData = structuredClone(cartItems);

    if (cardData[itemId]) {
      if (cardData[itemId][size]) {
        cardData[itemId][size] += 1;
      } else {
        cardData[itemId][size] = 1;
      }
    } else {
      cardData[itemId] = {};
      cardData[itemId][size] = 1;
    }

    setCartItems(cardData);
    if (token) {
      try {
        await api.post("/api/cart/add", { itemId, size });
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item]) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    const cartData = structuredClone(cartItems);

    // Always ensure item exists before accessing
    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    if (quantity === 0) {
      delete cartData[itemId][size];

      // Clean up empty item
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][size] = quantity;
    }

    setCartItems(cartData);

    if (token) {
      try {
        await api.post("/api/cart/update", { itemId, size, quantity });
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to update cart");
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    return totalAmount;
  };

  const getProductData = async () => {
    try {
      const response = await api.get("/api/product/list");
      if (response.data.success) {
        setProducts(response.data.products);
        // toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async () => {
    try {
      const response = await api.post("/api/cart/get");

      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // CHECK AUTH STATUS (NEW ERA)
  const checkAuth = async () => {
    // if (!token) {
    //   setAuthChecked(true);
    //   return;
    // }

    try {
      const res = await api.get("/api/user/check-auth");
      if (res.data.success) {
        setUser(res.data.user);
        await getUserCart();
      } else {
        setToken("");
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setToken("");
      setUser(null);
    } finally {
      setAuthChecked(true);
    }
  };

  // LOGOUT
  const logout = () => {
    setToken("");
    setUser(null);
    setCartItems({});
    localStorage.removeItem("phenzToken");
    toast.success("Logged out");
    navigate("/login");
  };

  // ON MOUNT
  useEffect(() => {
    getProductData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("phenzToken");
    if (token) setToken(token);
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("phenzToken", token);
    } else {
      localStorage.removeItem("phenzToken");
    }
  }, [token]);

  useEffect(() => {
    if (token !== "" && token !== null) {
      checkAuth();
    } else if (token === "") {
      // Token loaded but empty → no user
      setAuthChecked(true);
    }
  }, [token]);

  // useEffect(() => {
  //   if (token) {
  //     checkAuth();
  //   } else {
  //     setAuthChecked(true);
  //   }
  // }, [token]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
    authChecked,
    getUserCart,
    logout,
    api,
    user,
    visible,
    setVisible
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
