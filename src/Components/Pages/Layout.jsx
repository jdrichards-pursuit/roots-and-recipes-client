import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { getAuth } from "firebase/auth";
import homeIconPng from "../../assets/home_icon.png";
import familyIconPng from "../../assets/family_icon.png";
import plusIconPng from "../../assets/plus_icon.png";
import cookbookIconPng from "../../assets/cookbook_icon.png";
import profileIconPng from "../../assets/profile_icon.png";
import logoPng from "../../assets/logo.png";
import canvaLogo from "../../assets/canva_logo.png";

const Layout = ({ children }) => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

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
      <header className="bg-custom-brown text-white py-0 px-2 shadow-md fixed top-0 w-full z-20 flex justify-between items-center">
        <Link to="/home">
          <div className="flex items-center p-4">
            <img src={canvaLogo} alt="logo" className="w-60 h-24/>"></img>
          </div>
        </Link>
        <nav className="flex justify-between">
          {user ? (
            <>
              <Link to="/home" className="nav-item">
                Home
              </Link>
              <Link to="/family_cookbook" className="nav-item mr-[10px] ">
                Family
              </Link>
              <Link to="/create_a_recipe" className="nav-item ">
                Add
              </Link>
              <Link to="/cookbook" className="nav-item ">
                Cookbook
              </Link>
              <Link to="/profile" className="nav-item">
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-item lexend-exa">
                Log In
              </Link>
              <Link to="/register" className="nav-item lexend-exa">
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
              <div
                onClick={() => {
                  navigate("/home");
                  window.location.reload();
                }}
                className="flex items-center space-x-2">
                <img src={homeIconPng} alt="home icon" className="w-6 h-6" />
                <span>Home</span>
              </div>
              <div
                onClick={() => {
                  navigate("/family_cookbook");
                  window.location.reload();
                }}
                className="flex items-center space-x-2">
                <img
                  src={familyIconPng}
                  alt="family icon"
                  className="w-6 h-6"
                />
                <span>Family</span>
              </div>
              <div
                onClick={() => {
                  navigate("/create_a_recipe");
                  window.location.reload();
                }}
                className="flex items-center space-x-2">
                <img src={plusIconPng} alt="plus icon" className="w-8 h-8" />
                <span>Add</span>
              </div>
              <div
                onClick={() => {
                  navigate("/cookbook");
                  window.location.reload();
                }}
                className="flex items-center space-x-2">
                <img
                  src={cookbookIconPng}
                  alt="cookbook icon"
                  className="w-6 h-6"
                />
                <span>Cookbook</span>
              </div>
              <div
                onClick={() => {
                  navigate("/profile");
                  window.location.reload();
                }}
                className="flex items-center space-x-2">
                <img
                  src={profileIconPng}
                  alt="profile icon"
                  className="w-6 h-6"
                />
                <span>Profile</span>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center space-x-2 lexend-exa">
                <img
                  src={profileIconPng}
                  alt="login icon"
                  className="w-6 h-6"
                />
                <span>Log In</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center space-x-2 lexend-exa">
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

      {/* {isHomePage && (
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
      )} */}

      <main className="flex-grow pt-16 pb-16 overflow-y-auto">{children}</main>

      {/* <footer className="bg-custom-brown w-full p-4 fixed bottom-0 z-10" /> */}
    </div>
  );
};

export default Layout;
