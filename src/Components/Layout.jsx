import React from "react";
import { Link, useLocation } from "react-router-dom";
import homeIconPng from "../assets/home_icon.png";
import familyIconPng from "../assets/family_icon.png";
import plusIconPng from "../assets/plus_icon.png";
import cookbookIconPng from "../assets/cookbook_icon.png";
import profileIconPng from "../assets/profile_icon.png";

const Layout = ({ children, userName }) => {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="flex flex-col min-h-screen bg-custom-beige">
      {/* Header */}
      <header className="bg-custom-brown text-center py-4 fixed top-0 w-full z-10">
        <h1 className="text-2xl text-white">
          {userName ? `${userName}'s Cookbook` : "Roots & Recipe Cookbook"}
        </h1>
      </header>
      <main className="flex-grow p-4 mt-16 mb-16">{children}</main>
      {/* Footer */}
      {!isAuthPage && (
        <footer className="bg-custom-brown w-full p-4 flex justify-around fixed bottom-0 z-10">
          {/* Home Link */}
          <Link to="/home" className="flex flex-col items-center text-white">
            <img src={homeIconPng} alt="home icon" className="w-6 h-6 mb-1" />
            <span className="text-xs">Home</span>
          </Link>
          {/* Family Link */}
          <Link
            to="/family_cookbook"
            className="flex flex-col items-center text-white"
          >
            <img
              src={familyIconPng}
              alt="family icon"
              className="w-6 h-6 mb-1"
            />
            <span className="text-xs">Family</span>
          </Link>
          {/* Add Recipe Link */}
          <Link
            to="/recipe_form"
            className="flex flex-col items-center text-white"
          >
            <img src={plusIconPng} alt="plus icon" className="w-8 h-8 mb-1" />
            <span className="text-xs">Add</span>
          </Link>
          {/* Cookbook Link */}
          <Link
            to="/cookbook"
            className="flex flex-col items-center text-white"
          >
            <img
              src={cookbookIconPng}
              alt="cookbook icon"
              className="w-6 h-6 mb-1"
            />
            <span className="text-xs">Cookbook</span>
          </Link>
          {/* Profile Link */}
          <Link to="/profile" className="flex flex-col items-center text-white">
            <img
              src={profileIconPng}
              alt="profile icon"
              className="w-6 h-6 mb-1"
            />
            <span className="text-xs">Profile</span>
          </Link>
        </footer>
      )}
    </div>
  );
};

export default Layout;
