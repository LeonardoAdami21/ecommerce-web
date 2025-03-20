import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/frontend_assets/assets";
import { useState } from "react";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex items-center justify-between py-5 font-mediun">
      <img src={assets.logo} className="w-36" alt="" />
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink className="flex flex-col items-center gap-1" to="/">
          <p>Home</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700" />
        </NavLink>
        <NavLink className="flex flex-col items-center gap-1" to="/collection">
          <p>Colletion</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700" />
        </NavLink>
        <NavLink className="flex flex-col items-center gap-1" to="/about">
          <p>About</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700" />
        </NavLink>
        <NavLink className="flex flex-col items-center gap-1" to="/contact">
          <p>Contact</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-6">
        <img src={assets.search_icon} className="w-5 cursor-pointer" />
        <div className="group relative">
          <img src={assets.profile_icon} className="w-5 cursor-pointer" />
          <div className="group-hover:block absolute hidden drop-shadow-none right-0 pt-4">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-700 rounded">
              <p className="cursor-pointer hover:text-black">My Profile</p>
              <p className="cursor-pointer hover:text-black"> My Orders</p>
              <p className="cursor-pointer hover:text-black">Logout</p>
            </div>
          </div>
        </div>
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="" />
          <p className="absolute right-[-5px]  bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full  ">
            10
          </p>
          <img
            src={assets.menu_icon}
            onClick={() => setVisible(!visible)}
            className="w-5 cursor-pointer"
          />
        </Link>
      </div>
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden  bg-white transition-all ${visible ? "w-full" : "w-0"}`}
      ></div>
    </div>
  );
};

export default Navbar;
