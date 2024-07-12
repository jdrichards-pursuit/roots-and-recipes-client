import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { auth } from "./helpers/firebase";
import Login from "./Components/Login";
import SignUp from "./Components/Register";
import Profile from "./Components/Profile";
import FamilyForm from "./Components/Family/FamilyForm";
import JoinFamilyForm from "./Components/Family/JoinFamilyForm";
import FamilyCookbook from "./Components/Pages/FamilyCookbook";
import Home from "./Components/Pages/Home";
import RecipeForm from "./Components/Recipe/RecipeForm";
import RecipeList from "./Components/Recipe/RecipeList";
import RecipeShow from "./Components/Recipe/RecipeShow";
import AboutUs from "./Components/Hamburger/AboutUs";
import BurgerMenu from "./Components/Hamburger/BurgerMenu";
import ContactUs from "./Components/Hamburger/ContactUs";
import FAQ from "./Components/Hamburger/FAQ";
import { MyCookbook } from "./Components/Pages/MyCookbook";
import Layout from "./Components/Layout";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [burgerToggle, setBurgerToggle] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Layout userName={user ? user.displayName : null}>
      <BurgerMenu burgerToggle={burgerToggle} />
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/home" /> : <Login setBurgerToggle={setBurgerToggle} burgerToggle={burgerToggle} />}
        />
        <Route path="/login" element={<Login setBurgerToggle={setBurgerToggle} burgerToggle={burgerToggle} />} />
        <Route path="/register" element={<SignUp />} />
        {user && (
          <>
            <Route path="/profile" element={<Profile setBurgerToggle={setBurgerToggle} />} />
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
          </>
        )}
      </Routes>
      <ToastContainer />
    </Layout>
  );
}

export default App;
