import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
const URL = import.meta.env.VITE_BASE_URL;

// Loading spinner component
const Loading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-700">Loading Recipe...</h2>
      <p className="text-gray-500">
        Please wait while we fetch your delicious recipe!
      </p>
    </div>
  </div>
);

const RecipeShow = () => {
  const { id } = useParams();

  // State to store the recipe, initialized as null to indicate loading state
  const [singleRecipe, setSingleRecipe] = useState(null);

  // useEffect to fetch the recipe data when the component mounts or when the 'id' changes
  useEffect(() => {
    fetch(`${URL}/api/recipes/single_recipe/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSingleRecipe(data);
      })
      .catch((error) => console.error("Error fetching recipe:", error));
  }, [id]);

  // If singleRecipe is null, show the loading spinner
  if (!singleRecipe) {
    return <Loading />;
  }

  // Destructure the properties from the singleRecipe object
  const { name, ingredients, chef, family, created_at, photo, steps } =
    singleRecipe;

  // Split ingredients and steps into arrays
  const ingredientList = ingredients.split(", ");
  const stepsList = steps.split(", ");

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">{name}</h1>
      <img src={photo} alt={name} className="mb-4" />

      <p className="text-lg mb-2">
        <strong>Chef:</strong> {chef}
      </p>
      <p className="text-lg mb-2">
        <strong>Family:</strong> {family}
      </p>
      <p className="text-lg mb-2">
        <strong>Created at:</strong> {new Date(created_at).toLocaleDateString()}
      </p>

      <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
      <ul className="list-disc ml-5 mb-4">
        {ingredientList.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Steps</h2>
      <ol className="list-decimal ml-5">
        {stepsList.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </div>
  );
};

export default RecipeShow;
