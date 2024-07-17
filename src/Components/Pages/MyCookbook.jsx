import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
// import { useParams } from "react-router-dom";
import { Search } from "lucide-react";

import { getUserData } from "../../helpers/getUserData";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const URL = import.meta.env.VITE_BASE_URL;

export const MyCookbook = ({ setBurgerToggle }) => {
  const navigate = useNavigate();

  const [myRecipes, setMyRecipes] = useState([]);
  // useState for filtered recipes
  const [recipes, setRecipes] = useState([]);
  // useState for search bar inputs
  const [input, setInput] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  // const [allRecipes, setAllRecipes] = useState([]);

  //STATE FOR HEARTS FUNCTIONALITY
  const [heartStates, setHeartStates] = useState([]);

  // const user = getAuth().currentUser;

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
            setHeartStates(new Array(data.length).fill(false));
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
      // this is a helper function that will check the state of the current user in firebase and fetch the user using the JWT token from localstorage and the uid
      const user = await getUserData();
      // console.log("useEffect Profile:", user);
      if (user) {
        setUserDetails(user);
        fetchMyRecipes(user.id);

        // setMyRecipes([...allRecipes]);

        // setMyRecipes({ ...newRecipe, user_id: user.id });
      }
      setBurgerToggle(false);
    }

    getUser();
  }, []);

  // HEART TOGGLE
  const toggleHeart = (index) => {
    setHeartStates((prevStates) =>
      prevStates.map((state, i) => (i === index ? !state : state))
    );
  };

  const handleSearchChange = (event) => {
    const search = event.target.value;
    setInput(search);
    const result = search.length
      ? myRecipes.filter((recipe) =>
          recipe.name.toLowerCase().includes(search.toLowerCase())
        )
      : myRecipes;
    setRecipes(result);
  };

  return (
    <div className="text-center">
      <div className="bg-[#713A3A] text-[#FFDAB9]">MyCookbook</div>

      {/* Continue with the search functionality */}
      <div className=" bg-[#FFDAB9]">
        <div className="mr-2">
          <Search className="h-6 w-6 text-gray-300 ml-2" />
          <input
            className="h-full flex-grow outline-none text-sm text-black rounded-xl"
            type="text"
            id="search"
            placeholder="Search.."
            value={input}
            onChange={handleSearchChange}
          />
        </div>

        {/* Map the users recipes onto the page */}
        {!myRecipes.length ? (
          <Link to={"/create_a_recipe"}>
            <p className="text-center bg-[#D9D9D9]">
              Add a recipe
              <span>+</span>
            </p>
          </Link>
        ) : recipes.length > 0 ? (
          recipes.map((recipe, index) => (
            <div key={index} className="flex items-center mt-4 mx-10">
              <div className="border-solid border-2 border-black rounded-xl flex-1">
                <p
                  className={`${
                    index % 2 === 0
                      ? "bg-[#C7DEF1] text-[#713A3A]"
                      : "text-[#C7DEF1] bg-[#713A3A]"
                  } p-4 rounded-lg`}
                >
                  {recipe.name} <span className="ml-6">+</span>
                </p>
              </div>
              {/* <span className="ml-4 text-2xl">🤍</span>
               */}
              <span
                className="ml-4 text-2xl cursor-pointer"
                onClick={() => toggleHeart(index)}
              >
                {heartStates[index] ? "❤️" : "🤍"}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center bg-[#D9D9D9] p-4">
            No recipes of that name can be found
          </p>
        )}
      </div>
    </div>
  );
};
