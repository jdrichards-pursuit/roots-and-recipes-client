import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { X } from "lucide-react";

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
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Edit Your Recipe</h1>
        <div>
          <label htmlFor="name">Name of dish</label>
          <input
            type="text"
            id="name"
            value={name}
            name="name"
            onChange={handleTextChange}
          />
        </div>

        <div>
          <label htmlFor="chef">Chef</label>
          <input
            type="text"
            id="chef"
            value={chef}
            name="chef"
            onChange={handleTextChange}
          />
        </div>

        <div>
          <label>Ingredients</label>
          {ingredientsInputs.map((ingredient, index) => (
            <div key={index} className="flex items-center">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientsChange(index, e)}
                className="border-solid border-2 border-black p-2 mt-8"
              />
              <div type="button" onClick={() => handleDeleteIngredient(index)}>
                <X />
              </div>
            </div>
          ))}

          <div
            onClick={handleAddIngredient}
            className="ml-28 bg-zinc-100 text-black shadow-md border-2 border-black rounded-lg py-1 px-2 w-8 h-8 flex items-center justify-center cursor-pointer"
          >
            <Plus />
          </div>
        </div>

        <div>
          <label>Steps</label>
          {stepsInputs.map((step, index) => (
            <div key={index} className="flex items-center">
              <input
                type="text"
                value={step}
                onChange={(e) => handleStepsChange(index, e)}
                className="border-solid border-2 border-black p-2 mt-8"
              />
              <div type="button" onClick={() => handleDeleteStep(index)}>
                <X />
              </div>
            </div>
          ))}

          <div
            onClick={handleAddStep}
            className="ml-28 bg-zinc-100 text-black shadow-md border-2 border-black rounded-lg py-1 px-2 w-8 h-8 flex items-center justify-center cursor-pointer"
          >
            <Plus />
          </div>
        </div>

        <input type="submit" value="Save" />
      </form>
    </div>
  );
};

export default RecipeEditForm;
