import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { X } from "lucide-react";
import { Close as CloseIcon } from '@mui/icons-material';  // Import the MUI Close icon

import {
  handleIngredientsInputChange,
  handleAddIngredientsInput,
  handleIngredientDelete,
  handleStepsInput,
  handleStepsInputChange,
  handleStepDelete,
} from "../../helpers/helpers";

const URL = import.meta.env.VITE_BASE_URL;

const RecipeEditForm = () => {
  const { recipe_id } = useParams();
  const navigate = useNavigate();

  // STATE FOR THE INGREDIENTS
  const [ingredientsInputs, setIngredientsInputs] = useState([]);
  // STATE FOR THE STEPS
  const [stepsInputs, setStepsInputs] = useState([]);

  const [recipeToEdit, setRecipeToEdit] = useState({
    id: "",
    name: "",
    chef: "",
    family: "",
    user_id: "",
    photo: "",
    status: true,
    ingredients: "",
    steps: "",
  });

  const handleTextChange = (event) => {
    setRecipeToEdit({ ...recipeToEdit, [event.target.id]: event.target.value });
  };

  const handleIngredientsChange = (index, event) => {
    handleIngredientsInputChange(
      index,
      event,
      setIngredientsInputs,
      ingredientsInputs
    );
  };

  const handleAddIngredient = () => {
    handleAddIngredientsInput(setIngredientsInputs, ingredientsInputs);
  };

  const handleDeleteIngredient = (index) => {
    handleIngredientDelete(index, setIngredientsInputs, ingredientsInputs);
  };

  const handleStepsChange = (index, event) => {
    handleStepsInputChange(index, event, setStepsInputs, stepsInputs);
  };

  const handleAddStep = () => {
    handleStepsInput(setStepsInputs, stepsInputs);
  };

  const handleDeleteStep = (index) => {
    handleStepDelete(index, setStepsInputs, stepsInputs);
  };

  const updatedRecipe = () => {
    fetch(`${URL}/api/recipes/${recipe_id}`, {
      method: "PUT",
      body: JSON.stringify({
        ...recipeToEdit,
        ingredients: ingredientsInputs.join(", "),
        steps: stepsInputs.join(", "),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        navigate(`/cookbook`);
      })
      .catch((error) => console.log("catch", error));
  };

  useEffect(() => {
    fetch(`${URL}/api/recipes/single_recipe/${recipe_id}`)
      .then((res) => res.json())
      .then((data) => {
        setRecipeToEdit(data);
        setIngredientsInputs(data.ingredients.split(", "));
        setStepsInputs(data.steps.split(", "));
      })
      .catch((error) => console.error(error));
  }, [recipe_id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    updatedRecipe();
  };

  const { name, chef, photo, status, steps } = recipeToEdit;

  return (
    <div className="max-w-4xl mx-auto p-6 border border-gray-300 rounded-lg bg-white shadow-md mt-7">
      <CloseIcon onClick={() => navigate(-1)} />
      <h1 className="text-center text-3xl font-semibold text-[#713A3A] mb-6">
        Edit Your Recipe
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-lg font-medium mb-2">
            Name of dish
          </label>
          <input
            type="text"
            id="name"
            value={name}
            name="name"
            onChange={handleTextChange}
            className="w-full border border-gray-300 rounded-lg p-2 shadow-sm"
          />
        </div>

        <div>
          <label htmlFor="chef" className="block text-lg font-medium mb-2">
            Chef
          </label>
          <input
            type="text"
            id="chef"
            value={chef}
            name="chef"
            onChange={handleTextChange}
            className="w-full border border-gray-300 rounded-lg p-2 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-lg font-medium mb-2">Ingredients</label>
          {ingredientsInputs.map((ingredient, index) => (
            <div key={index} className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientsChange(index, e)}
                className="w-full border border-gray-300 rounded-lg p-2 shadow-sm"
              />
              <button
                type="button"
                onClick={() => handleDeleteIngredient(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          ))}

          <button
            onClick={handleAddIngredient}
            type="button"
            className="w-full bg-gray-200 text-gray-800 shadow-md border border-gray-300 rounded-lg p-2 flex items-center justify-center cursor-pointer"
          >
            <Plus />
          </button>
        </div>

        <div>
          <label className="block text-lg font-medium mb-2">Steps</label>
          {stepsInputs.map((step, index) => (
            <div key={index} className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                value={step}
                onChange={(e) => handleStepsChange(index, e)}
                className="w-full border border-gray-300 rounded-lg p-2 shadow-sm"
              />
              <button
                type="button"
                onClick={() => handleDeleteStep(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          ))}

          <button
            onClick={handleAddStep}
            type="button"
            className="w-full bg-gray-200 text-gray-800 shadow-md border border-gray-300 rounded-lg p-2 flex items-center justify-center cursor-pointer"
          >
            <Plus />
          </button>
        </div>

        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-4 py-2 shadow-md w-full"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default RecipeEditForm;
