import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../helpers/getUserData";

const URL = import.meta.env.VITE_BASE_URL;

function RecipeForm() {
  const navigate = useNavigate();

  // user state
  const [userDetails, setUserDetails] = useState(null);
  //  new recipe state
  const [newRecipe, setNewRecipe] = useState({
    name: "",
    family: "",
    chef: "",
    status: "TRUE",
    user_id: "",
  });

  // Function to add a new recipe
  const addRecipe = () => {
    fetch(`${URL}/api/recipes`, {
      method: "POST",
      body: JSON.stringify(newRecipe),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("New recipe added:", data);
        setNewRecipe(data);
        navigate(`/cookbook`);
      })
      .catch((error) => {
        console.error("Error adding recipe:", error);
      });
  };

  // handle Submit function
  const handleSubmit = (event) => {
    event.preventDefault();
    addRecipe();
  };

  const handleTextChange = (event) => {
    setNewRecipe({ ...newRecipe, [event.target.id]: event.target.value });
  };

  // Use Effect
  useEffect(() => {
    async function getUser() {
      // this is a helper function that will check the state of the current user in firebase and fetch the user using the JWT token from localstorage and the uid
      const user = await getUserData();
      // console.log("useEffect Profile:", user);
      if (user) {
        setUserDetails(user);
        setNewRecipe({ ...newRecipe, user_id: user.id });
      }
    }

    getUser();
  }, []);

  return (
    <div className="ml-28 border-2 border-black border-solid">
      <h1 className="text-center">New Recipe</h1>
      <form onSubmit={handleSubmit}>
        {/* Dish Name Input */}
        <label>
          <h2>Name of dish</h2>
        </label>
        <input
          id="name"
          value={newRecipe.name}
          type="text"
          onChange={handleTextChange}
          placeholder="Name of dish"
          required
          className="shadow-md border-2 border-black hover:bg-white bg-zinc-100 rounded-lg py-2 px-3"
        />

        {/* Family name input */}
        <label>
          <h2>Family</h2>
        </label>
        <input
          id="family"
          value={newRecipe.family}
          type="text"
          onChange={handleTextChange}
          placeholder="Family"
          required
          className="shadow-md border-2 border-black hover:bg-white bg-zinc-100 rounded-lg py-2 px-3"
        />

        {/* Chef Input (if needed) */}
        <label>
          <h2>Chef</h2>
        </label>
        <input
          id="chef"
          value={newRecipe.chef}
          type="text"
          onChange={handleTextChange}
          placeholder="Chef"
          className="shadow-md border-2 border-black hover:bg-white bg-zinc-100 rounded-lg py-2 px-3"
        />

        {/* Submit/Save Button */}
        <div className="flex justify-between mt-10">
          <input
            type="submit"
            value="Save"
            className="bg-emerald-500 hover:bg-green-500 rounded-lg px-1 py-0 shadow-md w-1/2 mb-10 ml-2"
          />
          <button
            onClick={() => navigate(-1)}
            className="bg-red-400 hover:bg-red-500 rounded-lg px-1 py-0 shadow-md w-1/2 mb-10 ml-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default RecipeForm;
