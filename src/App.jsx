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
import { MyCookbook } from "./Components/Pages/MyCookbook";
import Layout from "./Components/Pages/Layout";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

import CreatARecipe from "./Components/Pages/CreatARecipe";
import { DishCameraView } from "./Components/DishCameraView";
import { FamilyMembers } from "./Components/Pages/FamilyMembers";

function App() {
  const [user, setUser] = useState(null);
  const [navBarToggle, setNavBarToggle] = useState(true);

  //  new recipe state
  const [newRecipe, setNewRecipe] = useState({
    name: "",
    family_id: 1,
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
            <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/home" />
            ) : (
              <Login
                setNavBarToggle={setNavBarToggle}
              />
            )
          }
        />
        <Route
          path="/login"
          element={
            <Login
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
                  setNavBarToggle={setNavBarToggle}
                />
              }
            />
            <Route
              path="/cookbook"
              element={
                <MyCookbook
                  setNavBarToggle={setNavBarToggle}
                />
              }
            />
            <Route
              path="/home"
              element={
                <Home
                  setNavBarToggle={setNavBarToggle}
                />
              }
            />
            <Route
              path="/recipe_form"
              element={
                <RecipeForm
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
                />
              }
            />

            <Route path="/family_members" element={<FamilyMembers />} />
            <Route path="/recipe_show/:id" element={<RecipeShow />} />
            <Route path="/create_a_recipe" element={<CreatARecipe />} />
          </>
        )}
      </Routes>
      <ToastContainer />
    </Layout>
  );
}

export default App;
