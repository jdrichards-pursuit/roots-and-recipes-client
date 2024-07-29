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
import RecipeEditForm from "./Components/Recipe/RecipeEditForm";
import RecipeList from "./Components/Recipe/RecipeList";
import RecipeShow from "./Components/Recipe/RecipeShow";
import AboutUs from "./Components/Hamburger/AboutUs";
import BurgerMenu from "./Components/Hamburger/BurgerMenu";
import ContactUs from "./Components/Hamburger/ContactUs";
import FAQ from "./Components/Hamburger/FAQ";
import { MyCookbook } from "./Components/Pages/MyCookbook";
import Layout from "./Components/Pages/Layout";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

import CreatARecipe from "./Components/Pages/CreatARecipe";
import { DishCameraView } from "./Components/DishCameraView";

function App() {
  const [user, setUser] = useState(null);
  const [burgerToggle, setBurgerToggle] = useState(false);
  const [navBarToggle, setNavBarToggle] = useState(true);

  //  new recipe state
  const [newRecipe, setNewRecipe] = useState({
    name: "",
    family: "",
    chef: "",
    status: "TRUE",
    user_id: "",
    photo: "",
    ingredients: "",
    steps: "",
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Layout
      userName={user ? user.displayName : null}
      navBarToggle={navBarToggle}
    >
      <BurgerMenu burgerToggle={burgerToggle} />
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/home" />
            ) : (
              <Login
                setBurgerToggle={setBurgerToggle}
                burgerToggle={burgerToggle}
                setNavBarToggle={setNavBarToggle}
              />
            )
          }
        />
        <Route
          path="/login"
          element={
            <Login
              setBurgerToggle={setBurgerToggle}
              burgerToggle={burgerToggle}
              setNavBarToggle={setNavBarToggle}
            />
          }
        />
        <Route
          path="/register"
          element={<SignUp setNavBarToggle={setNavBarToggle} />}
        />
        {user && (
          <>
            <Route
              path="/profile"
              element={
                <Profile
                  setBurgerToggle={setBurgerToggle}
                  setNavBarToggle={setNavBarToggle}
                />
              }
            />
            <Route path="/family_form" element={<FamilyForm />} />
            <Route path="/join_family" element={<JoinFamilyForm />} />

            <Route
              path="/family_cookbook"
              element={
                <FamilyCookbook
                  setBurgerToggle={setBurgerToggle}
                  setNavBarToggle={setNavBarToggle}
                />
              }
            />
            <Route
              path="/cookbook"
              element={
                <MyCookbook
                  setBurgerToggle={setBurgerToggle}
                  setNavBarToggle={setNavBarToggle}
                />
              }
            />
            <Route
              path="/home"
              element={
                <Home
                  setBurgerToggle={setBurgerToggle}
                  setNavBarToggle={setNavBarToggle}
                />
              }
            />
            <Route
              path="/recipe_form"
              element={
                <RecipeForm
                  setBurgerToggle={setBurgerToggle}
                  setNewRecipe={setNewRecipe}
                  newRecipe={newRecipe}
                  setNavBarToggle={setNavBarToggle}
                />
              }
            />
            <Route
              path="/edit/:recipe_id"
              element={
                <RecipeEditForm
                  setNewRecipe={setNewRecipe}
                  newRecipe={newRecipe}
                />
              }
            />

            <Route
              path="/dish_photo"
              element={
                <DishCameraView
                  setBurgerToggle={setBurgerToggle}
                  newRecipe={newRecipe}
                  setNewRecipe={setNewRecipe}
                  setNavBarToggle={setNavBarToggle}
                />
              }
            />

            <Route
              path="/recipe_list"
              element={
                <RecipeList
                  setNavBarToggle={setNavBarToggle}
                  setBurgerToggle={setBurgerToggle}
                />
              }
            />
            <Route path="/recipe_show/:id" element={<RecipeShow />} />
            <Route path="/about_us" element={<AboutUs />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact_us" element={<ContactUs />} />

            <Route path="/create_a_recipe" element={<CreatARecipe />} />
          </>
        )}
      </Routes>
      <ToastContainer />
    </Layout>
  );
}

export default App;
