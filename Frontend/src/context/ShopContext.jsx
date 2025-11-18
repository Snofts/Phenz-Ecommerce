import { createContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();


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

const ShopContextProvider = (props) => {
  const currency = "₦";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [ibadanFee, setIbadanFee] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0)
  const navigate = useNavigate();

  //  const delivery_fee = 10;

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

  // Find region from state
  const getRegionFromState = (state) => {
    if (state === "Ibadan") return "ibadan";
    for (const [region, data] of Object.entries(REGIONS)) {
      if (data.states.includes(state)) {
        return region;
      }
    }
    return null;
  };

  // Get delivery fee
  const getDeliveryFee = () => {
    if (!selectedState) return 0;
    const region = getRegionFromState(selectedState);
    return DELIVERY_RATES[region]?.fee || 0;
  };

  // console.log(selectedState)

  // Get full delivery info
  const getDeliveryInfo = () => {
  if (!selectedState) return {};
  const region = getRegionFromState(selectedState);
  return DELIVERY_RATES[region] || {};
};

 // FINAL DELIVERY FEE LOGIC
const delivery_fee = useMemo(() => {
  if (ibadanFee === "ibadan") return 1000;
  if (selectedState){
    const fee = getDeliveryFee();
    setDeliveryFee(fee)
    return getDeliveryFee();
  } 
  return 0;
}, [ibadanFee, selectedState]);

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
    setVisible,
    selectedState,
    setIbadanFee,
    setSelectedState,
    getDeliveryFee,
    getDeliveryInfo,
    deliveryFee,
    setDeliveryFee
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
