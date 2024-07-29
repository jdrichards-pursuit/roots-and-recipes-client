import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const BurgerMenu = () => {
  const [hamMenuToggle, setHamMenuToggle] = useState(false);

  return (
    <div className="relative">
      <button
        className="text-white focus:outline-none"
        onClick={() => setHamMenuToggle(!hamMenuToggle)}
      >
        {hamMenuToggle ? (
          <AiOutlineClose size={24} />
        ) : (
          <AiOutlineMenu size={24} />
        )}
      </button>
      {hamMenuToggle && (
        <div className="absolute right-0 mt-2 w-48 bg-[#713A3A] rounded shadow-lg z-20">
          <Link
            to="/about_us"
            className="block px-4 py-2 text-white hover:bg-[#512929]"
          >
            About Us
          </Link>
          <Link
            to="/faq"
            className="block px-4 py-2 text-white hover:bg-[#512929]"
          >
            FAQ
          </Link>
          <Link
            to="/contact_us"
            className="block px-4 py-2 text-white hover:bg-[#512929]"
          >
            Contact Us
          </Link>
        </div>
      )}
    </div>
  );
};

export default BurgerMenu;
