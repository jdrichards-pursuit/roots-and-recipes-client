import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const URL = import.meta.env.VITE_BASE_URL;

function RecipeForm() {
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState({
    dish_name: "",
    family_name: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    // send to the backend
  };

  const handleTextChange = (event) => {
    setRecipe({ ...recipe, [event.target.id]: event.target.value });
  };

  return (
    <div className="ml-28 border-2 border-black border-solid">
      <h1 className="text-center">New Recipe</h1>
      <form onSubmit={handleSubmit}>
        {/* Dish Name Input */}
        <label>
          <h2>Name of dish</h2>
        </label>
        <input
          id="dish_name"
          value={recipe.dish_name}
          type="text"
          onChange={handleTextChange}
          placeholder="dish_name"
          required
          className="shadow-md border-2 border-black hover:bg-white bg-zinc-100 rounded-lg py-2 px-3"
        />

        {/* Family name input */}
        <label>
          <h2>Family</h2>
        </label>
        <input
          id="family_name"
          value={recipe.family_name}
          type="text"
          onChange={handleTextChange}
          placeholder="family_name"
          required
          className="shadow-md border-2 border-black hover:bg-white bg-zinc-100 rounded-lg py-2 px-3"
        />
        {/* Ingredients Input */}
        <label>
          <h2>Ingredients</h2>
        </label>
        <input
          id="ingredients"
          value=""
          type="text"
          // onChange={handleTextChange}
          placeholder="ingredients"
          // required
          className="shadow-md border-2 border-black hover:bg-white bg-zinc-100 rounded-lg py-2 px-3"
        />

        {/* Quantity Input */}
        <input
          id="quantity"
          value="Quantity"
          type="text"
          // onChange={handleTextChange}
          placeholder="quantity"
          // required
          // className="shadow-md border-2 border-black hover:bg-white bg-zinc-100 rounded-lg py-0.05 px-0 text-center text-xs"
          className="ml-4 shadow-md border-2 border-black hover:bg-white bg-zinc-100 rounded-lg py-0.5 px-1 text-center text-xs w-20"
        />

        {/* Unit Input */}
        <input
          id="unit"
          value="Unit"
          type="text"
          // onChange={handleTextChange}
          placeholder="unit"
          // required
          // className="shadow-md border-2 border-black hover:bg-white bg-zinc-100 rounded-lg py-0.05 px-0 text-center text-xs"
          className="ml-4 shadow-md border-2 border-black hover:bg-white bg-zinc-100 rounded-lg py-0.5 px-1 text-center text-xs w-20"
        />
        {/* Plus Sign */}

        <label className="mt-4"></label>
        <input
          id="add ingredient"
          value="+"
          type="text"
          // onChange={handleTextChange}
          placeholder="add ingredient"
          // required
          className="shadow-md border-2 border-black hover:bg-white bg-zinc-100 rounded-lg py-2 px-3 text-center text-xl"
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
