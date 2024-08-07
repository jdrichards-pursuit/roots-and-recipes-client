import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { getAuth } from "firebase/auth";
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
    <div className="flex flex-col min-h-screen bg-[#FFDAB9]">
      <header className="bg-[#713A3A] text-white py-0 px-2 shadow-md fixed top-0 w-full z-20 flex justify-between items-center">
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
        <nav className="lg:hidden bg-[#713A3A] text-white p-4 fixed top-16 w-full z-20 space-y-4">
          {user ? (
            <>
              <div
                onClick={() => {
                  navigate("/home");
                  window.location.reload();
                }}
                className="flex items-center space-x-2">
                <span className="hover:text-[#965d5d]">Home</span>
              </div>
              <div
                onClick={() => {
                  navigate("/family_cookbook");
                  window.location.reload();
                }}
                className="flex items-center space-x-2">
              
                <span className="hover:text-[#965d5d]">Family</span>
              </div>
              <div
                onClick={() => {
                  navigate("/create_a_recipe");
                  window.location.reload();
                }}
                className="flex items-center space-x-2">
                <span className="hover:text-[#965d5d]">Add</span>
              </div>
              <div
                onClick={() => {
                  navigate("/cookbook");
                  window.location.reload();
                }}
                className="flex items-center space-x-2">
                <span className="hover:text-[#965d5d]">Cookbook</span>
              </div>
              <div
                onClick={() => {
                  navigate("/profile");
                  window.location.reload();
                }}
                className="flex items-center space-x-2">
                <span className="hover:text-[#965d5d]">Profile</span>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center space-x-2">
                <span className="hover:text-[#965d5d]">Log In</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center space-x-2">
                <span className="hover:text-[#965d5d]">Register</span>
              </Link>
            </>
          )}
        </nav>
      )}
      <main className="flex-grow pt-16 overflow-y-auto">{children}</main>
    </div>
  );
};

export default Layout;
