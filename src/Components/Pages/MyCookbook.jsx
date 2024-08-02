import { useState, useEffect } from "react";
// import { getAuth } from "firebase/auth";

import { getUserData } from "../../helpers/getUserData";

import { capitalizeFirstLetter } from "../../helpers/helpers";
import useHandleSearchChange from "../../helpers/useHandleSearchChange";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle"; // Importing the AddCircleIcon

const URL = import.meta.env.VITE_BASE_URL;

export const MyCookbook = () => {
  const navigate = useNavigate();

  const [myRecipes, setMyRecipes] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalChoice, setModalChoice] = useState("");

  const { searchInput, handleSearchChange, clearSearch } =
    useHandleSearchChange(myRecipes, setRecipes, (isDefault) => {
      if (isDefault) {
        setRecipes(myRecipes);
      }
    });

  const fetchMyRecipes = (userId) => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${URL}/api/recipes/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setMyRecipes(data);
            setRecipes(data);
          } else {
            console.error("Error fetching recipes:", data);
            setMyRecipes([]);
            setRecipes([]);
          }
        })
        .catch((error) => console.error("Error fetching user:", error));
    }
  };

  useEffect(() => {
    async function getUser() {
      const user = await getUserData();
      if (user && !user.message) {
        setUserDetails(user);
        fetchMyRecipes(user.id);
      } else {
        console.error("Invalid user data:", user);
      }
    }

    getUser();
  }, []);

  const handleClick = (recipe) => {
    if (userDetails && userDetails.family_code !== "000000") {
      fetch(
        `${URL}/api/families/recipe/${recipe.id}/${userDetails.family_code}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .catch((error) => console.error("Error:", error));
    }
    navigate("/family_cookbook", window.location.reload);
  };

  // Determine the display name based on nickname or first name
  const displayName = userDetails
    ? userDetails.nickname
      ? `${capitalizeFirstLetter(userDetails.nickname)}'s Cookbook`
      : userDetails.first_name
      ? `${capitalizeFirstLetter(
          userDetails.first_name.split(" ")[0]
        )}'s Cookbook`
      : "My Cookbook"
    : "My Cookbook";

  return (
    <div className="text-center p-4">
      <div className="bg-[#713A3A] text-[#FFDAB9] py-4 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold">{displayName}</h1>
      </div>
      <div className="bg-[#FFDAB9] p-4 rounded-lg shadow-md">
        <div className="flex justify-center mb-4">
          <div className="relative w-64">
            <input
              className="h-full w-full outline-none text-lg text-black rounded-lg px-4 py-2"
              type="text"
              id="search"
              placeholder="Search"
              value={searchInput}
              onChange={handleSearchChange}
            />
            {searchInput ? (
              <div
                onClick={clearSearch}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 cursor-pointer p-1">
                <ClearIcon />
              </div>
            ) : (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1">
                <SearchIcon />
              </div>
            )}
          </div>
        </div>

        {!myRecipes.length ? (
          <Link to={"/create_a_recipe"}>
            <p className="text-center bg-[#D9D9D9] p-4 rounded-lg shadow-md">
              Add a recipe <span className="text-2xl font-bold">+</span>
            </p>
          </Link>
        ) : recipes.length > 0 ? (
          recipes
            .sort((a, b) => a.id - b.id)
            .map((recipe) => (
              <div
                key={recipe.id}
                className="flex items-center justify-between bg-white p-2 rounded-lg shadow-md mb-4">
                <Link to={`/recipe_show/${recipe.id}`} className="flex-1 ml-2">
                  <div className="rounded-xl">
                    <img src={recipe.photo} alt={recipe.name} />
                    <p className="p-4 rounded-lg text-black text-lg">
                      {recipe.chef}'s {recipe.name}
                    </p>
                  </div>
                </Link>
                <div className="flex items-center">
                  <EditIcon
                    onClick={() => navigate(`/edit/${recipe.id}`)}
                    className="cursor-pointer mr-2"
                  />
                  <AddCircleIcon
                    onClick={() => handleClick(recipe)}
                    className="text-[#713A3A] cursor-pointer"
                  />
                </div>
              </div>
            ))
        ) : (
          <p className="text-center bg-[#D9D9D9] p-4 rounded-lg shadow-md">
            Sorry, recipe cannot be found
          </p>
        )}
      </div>
    </div>
  );
};
