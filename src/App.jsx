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
import Favortites from "./Components/Pages/Favortites";
import Home from "./Components/Pages/Home";
import NavBar from "./Components/Pages/NavBar";
// import PlusIcon from "./Components/Pages/PlusIcon";
import UserProfile from "./Components/Pages/UserProfile";
import RecipeForm from "./Components/Recipe/RecipeForm";
import RecipeList from "./Components/Recipe/RecipeList";
import RecipeShow from "./Components/Recipe/RecipeShow";
import AboutUs from "./Components/Hamburger/AboutUs";
import BurgerMenu from "./Components/Hamburger/BurgerMenu";
import ContactUs from "./Components/Hamburger/ContactUs";
import FAQ from "./Components/Hamburger/FAQ";

function App() {
  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });
  return (
    <div>
      <AboutUs />
      <BurgerMenu />
      <ContactUs />
      <FAQ />

      <Routes
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 100,
        }}
      >
        <Route
          path="/"
          element={user ? <Navigate to="/profile" /> : <Login />}
        />
        <Route path="/test" element={user ? <Test /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        {/* Need to fix the paths below */}
        <Route path="/family_form" element={<FamilyForm />} />
        <Route path="/join_family" element={<JoinFamilyForm />} />
        <Route path="/family_cookbook" element={<FamilyCookbook />} />
        <Route path="/favorites" element={<Favortites />} />
        <Route path="/home" element={<Home />} />
        <Route path="/user_profile" element={<UserProfile />} />
        <Route path="/recipe_form" element={<RecipeForm />} />
        <Route path="/recipe_list" element={<RecipeList />} />
        <Route path="/recipe_show" element={<RecipeShow />} />
      </Routes>
      <NavBar />
      {/* <PlusIcon /> */}
      <ToastContainer />
    </div>
  );
}

export default App;
