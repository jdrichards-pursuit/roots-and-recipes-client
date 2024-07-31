import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { getAuth } from "firebase/auth";
import homeIconPng from "../../assets/home_icon.png";
import familyIconPng from "../../assets/family_icon.png";
import plusIconPng from "../../assets/plus_icon.png";
import cookbookIconPng from "../../assets/cookbook_icon.png";
import profileIconPng from "../../assets/profile_icon.png";

const Layout = ({ children }) => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const isHomePage = location.pathname === "/home";
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="flex flex-col min-h-screen bg-custom-beige">
      <header className="bg-custom-brown text-white py-4 px-6 shadow-md fixed top-0 w-full z-20 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-4xl font-bold">Roots & Recipe</h1>
        </div>
        <nav className="hidden lg:flex space-x-6 items-center">
          {user ? (
            <>
              <Link to="/home" className="nav-item">
                Home
              </Link>
              <Link to="/family_cookbook" className="nav-item">
                Family
              </Link>
              <Link to="/create_a_recipe" className="nav-item">
                Add
              </Link>
              <Link to="/cookbook" className="nav-item">
                Cookbook
              </Link>
              <Link to="/profile" className="nav-item">
                <img
                  src={profileIconPng}
                  alt="profile icon"
                  className="nav-profile-icon"
                />
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-item">
                Log In
              </Link>
              <Link to="/register" className="nav-item">
                Register
              </Link>
            </>
          )}
        </nav>
        <button className="lg:hidden text-white" onClick={toggleMenu}>
          {menuOpen ? (
            <AiOutlineClose size={24} />
          ) : (
            <AiOutlineMenu size={24} />
          )}
        </button>
      </header>

      {menuOpen && (
        <nav className="lg:hidden bg-custom-brown text-white p-4 fixed top-16 w-full z-20 space-y-4">
          {user ? (
            <>
              <Link to="/home" className="flex items-center space-x-2">
                <img src={homeIconPng} alt="home icon" className="w-6 h-6" />
                <span>Home</span>
              </Link>
              <Link
                to="/family_cookbook"
                className="flex items-center space-x-2"
              >
                <img
                  src={familyIconPng}
                  alt="family icon"
                  className="w-6 h-6"
                />
                <span>Family</span>
              </Link>
              <Link to="/create_a_recipe" className="flex items-center space-x-2">
                <img src={plusIconPng} alt="plus icon" className="w-8 h-8" />
                <span>Add </span>
              </Link>
              <Link to="/cookbook" className="flex items-center space-x-2">
                <img
                  src={cookbookIconPng}
                  alt="cookbook icon"
                  className="w-6 h-6"
                />
                <span>Cookbook</span>
              </Link>
              <Link to="/profile" className="flex items-center space-x-2">
                <img
                  src={profileIconPng}
                  alt="profile icon"
                  className="w-6 h-6"
                />
                <span>Profile</span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center space-x-2">
                <img
                  src={profileIconPng}
                  alt="login icon"
                  className="w-6 h-6"
                />
                <span>Log In</span>
              </Link>
              <Link to="/register" className="flex items-center space-x-2">
                <img
                  src={profileIconPng}
                  alt="register icon"
                  className="w-6 h-6"
                />
                <span>Register</span>
              </Link>
            </>
          )}
        </nav>
      )}

      {isHomePage && (
        <nav className="bg-white py-1 shadow-md fixed top-16 w-full z-10 flex justify-center space-x-2 text-gray-700 slim-navbar">
          <a href="#top-dinner" className="hover:text-red-500">
            Top Dinner
          </a>
          <span className="separator-bar"></span>
          <a href="#top-all-recipes" className="hover:text-red-500">
            Top All Recipes
          </a>
          <span className="separator-bar"></span>
          <a href="#top-lunch" className="hover:text-red-500">
            Top Lunch
          </a>
        </nav>
      )}

      <main className="flex-grow pt-28 pb-16 overflow-y-auto">{children}</main>

      <footer className="bg-custom-brown w-full p-4 fixed bottom-0 z-10" />
    </div>
  );
};

export default Layout;
