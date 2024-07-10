import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { auth } from "./helpers/firebase";

import Login from "./Components/Login";
import SignUp from "./Components/Register";
import Profile from "./Components/Profile";
import Test from "./Components/Test";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import FamilyForm from "./Components/Family/FamilyForm";
import JoinFamilyForm from "./Components/Family/JoinFamilyForm";
import FamilyCookbook from "./Components/Pages/FamilyCookbook";
import Home from "./Components/Pages/Home";
import NavBar from "./Components/Pages/NavBar";
// import PlusIcon from "./Components/Pages/PlusIcon";
import RecipeForm from "./Components/Recipe/RecipeForm";
import RecipeList from "./Components/Recipe/RecipeList";
import RecipeShow from "./Components/Recipe/RecipeShow";
import AboutUs from "./Components/Hamburger/AboutUs";
import BurgerMenu from "./Components/Hamburger/BurgerMenu";
import ContactUs from "./Components/Hamburger/ContactUs";
import FAQ from "./Components/Hamburger/FAQ";
import { MyCookbook } from "./Components/Pages/MyCookbook";

function App() {
  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });

  return (
    <div>
      <BurgerMenu />
      <Routes
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 100,
        }}>
        <Route
          path="/"
          element={user ? <Navigate to="/profile" /> : <Login />}
        />
        {/* <Route path="/test" element={user ? <Test /> : <Login />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        {/* Need to fix the paths below */}
        <Route path="/family_form" element={<FamilyForm />} />
        <Route path="/join_family" element={<JoinFamilyForm />} />
        <Route path="/family_cookbook" element={<FamilyCookbook />} />
        <Route path="/cookbook" element={<MyCookbook />} />
        <Route path="/home" element={<Home />} />
        <Route path="/recipe_form" element={<RecipeForm />} />
        <Route path="/recipe_list" element={<RecipeList />} />
        <Route path="/recipe_show" element={<RecipeShow />} />
        <Route path="/about_us" element={<AboutUs />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact_us" element={<ContactUs />} />
      </Routes>
      {user && <NavBar />}
      {/* <PlusIcon /> */}
      <ToastContainer />
    </div>
  );
}

export default App;
