import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import placeholderImage from "../../assets/recipe_place_holder.png";

const URL = import.meta.env.VITE_BASE_URL;

const RecipeShow = () => {
  const { id } = useParams();

  //  STATE TO STORE THE RECIPE
  const [singleRecipe, setSingleRecipe] = useState(null);
  const [recipeCategories, setRecipeCategories] = useState([]);
  // had to change the initial state from being empty to null. i guess to let it be known there will be something there soon or to indicate "loading state"

  console.log(singleRecipe);
  useEffect(() => {
    fetch(`${URL}/api/recipes/single_recipe/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSingleRecipe(data);
      })
      .catch((error) => console.error("Error fetching recipe:", error));

    fetch(`${URL}/api/categories/recipes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setRecipeCategories(data.map((elem) => elem.category_name));
      })
      .catch((error) => console.error("Error fetching recipe:", error));
  }, [id]);
  // I had to add the id to the dependency array to get rid of the error i was receiving when refreshing the page
  // This dependency array includes 'id' to refetch data if the 'id' changes

  if (!singleRecipe) {
    return <div>Loading...</div>;
  }

  // Destructure the properties from the singleRecipe object
  const { name, ingredients, chef, family, created_at, photo, steps } =
    singleRecipe;

  // Split ingredients and steps into arrays
  const ingredientList = ingredients.split(",").map((item) => item.trim());
  const stepsList = steps.split(",").map((item) => item.trim());

  return (
    <div className="p-4 bg-[#C7DEF1] rounded-lg shadow-lg">
      <div className="bg-white rounded-md p-4 mb-3">
      <h1 className="text-2xl font-bold mb-4 text-center">{name}</h1>
      <img src={photo || placeholderImage} alt={name} className="mb-4 shadow-xl" />
      <p className="text-lg mb-2 font-bold">
        Family:
        <span className="font-thin"> {family}</span>
      </p>
      <p className="text-lg mb-2">Chef: {chef}</p>
       {family !== "defaultFamily" && (
      <p className="text-lg mb-2 font-bold">
        Family:
        <span className="font-thin"> {family}</span>
      </p>
       )}
      <p className="text-lg mb-2">
        Created at: {new Date(created_at).toLocaleDateString()}
      </p>
    </div>
    <div className="bg-white shadow-lg rounded-md p-4" >
      <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
      <ul className="list-disc ml-5 mb-4">
        {ingredientList.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
    </div>
    <div className="bg-white shadow-lg rounded-md p-4 mt-3">
      <h2 className="text-xl font-semibold mb-2">Steps</h2>
      <ol className="list-decimal ml-5">
        {stepsList.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>

      <div>
        <h1 className="text-xl font-semibold mb-2">Categories</h1>
        {recipeCategories.length > 0 &&
          recipeCategories.map((category, index) => {
            return <li key={index}>{category}</li>;
          })}
      </div>
    </div>
    </div>
  );
};

export default RecipeShow;
