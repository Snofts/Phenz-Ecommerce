import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";


const Footer = () => {
  const {navigate} = useContext(ShopContext);

  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img src={assets.logo} className="w-32 mb-5" alt="" />
          <p className="w-full md:w-2/3 text-gray-600">
            <span className="uppercase">PHENZ</span> is a reflection of mood, presence, and quiet confidence, created for people who don’t overthink style. PHENZ makes it easy to show up as you are raw, timeless, and entirely real. Every piece is built on one belief: your clothes should feel like you. Not curated. Not performative. Just true.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li onClick={() => navigate("/")}>Home</li>
            <li onClick={() => navigate("/about")}>About us</li>
            <li onClick={() => navigate("/delivery")}>Delivery</li>
            <li onClick={() => navigate("/policy")}>Privacy policy</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+234 816 424 9316</li>
            <li>Byphenz@gmail.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copy right 2025@ Phenz.ng - All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
