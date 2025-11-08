import axios from "axios";
import { backendUrl } from "../App";
import { assets } from "../assets/assets";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${backendUrl}/api/user/admin/logout`, {}, { withCredentials: true });
      setIsAuthenticated(false);
      navigate("/admin-login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
  const verifyAdmin = async () => {
    const res = await axios.get(`${backendUrl}/api/user/admin-verify`, {
      withCredentials: true,
    });
    if (!res.data.success) {
      setIsAuthenticated(false);
      navigate("/admin-login");
    }
  };
  verifyAdmin();
}, []);


  return (
    <div className="flex items-center py-2 px-[4%] justify-between">
      <img className="w-[max(10%,80px)]" src={assets.logo} alt="" />
      <button
        onClick={handleLogout}
        className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
