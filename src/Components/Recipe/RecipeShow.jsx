import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { PlayIcon, PauseIcon, StopIcon, MinusCircleIcon, PlusCircleIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import placeholderImage from "../../assets/recipe_place_holder.png";
import { capitalizeFirstLetter } from "../../helpers/helpers";

const URL = import.meta.env.VITE_BASE_URL;

const RecipeShow = () => {
  const { id } = useParams();
  const [rate, setRate] = useState(1);

  const [singleRecipe, setSingleRecipe] = useState(null);
  const [recipeCategories, setRecipeCategories] = useState([]);
  const [rate, setRate] = useState(1);

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

  if (!singleRecipe) {
    return <div>Loading...</div>;
  }

  const { name, ingredients, chef, family, created_at, photo, steps } =
    singleRecipe;

  const ingredientList = ingredients.split(",").map((item) => item.trim());
  const stepsList = steps.split(",").map((item) => item.trim());

  function handleRead() {
    if (!singleRecipe.ingredients || !singleRecipe.steps) {
      console.error(
        "Single Recipe does not have the expected structure",
        singleRecipe
      );
      return;
    }

    const introductionUtterance = new SpeechSynthesisUtterance(
      `This is the ${name} recipe from ${chef}.......`
    );
    const ingredientsUtterance = new SpeechSynthesisUtterance(
      `Here are the Ingredients........ ${ingredients}`
    );
    const instructionsUtterance = new SpeechSynthesisUtterance(
      `And now the steps for preparation. ${steps}`
    );


    // Set the rate of speech
    introductionUtterance.rate = rate;
    ingredientsUtterance.rate = rate;
    instructionsUtterance.rate = rate;


    // Speak the ingredients and instructions
    window.speechSynthesis.speak(introductionUtterance);
    window.speechSynthesis.speak(ingredientsUtterance);
    window.speechSynthesis.speak(instructionsUtterance);
  }


  // Pause the speech
  function handlePause() {
    window.speechSynthesis.pause();
  }
  // Resume the speech
  function handleResume() {
    window.speechSynthesis.resume();
  }



  function handleStop() {
    window.speechSynthesis.cancel();
  }

  function increaseRate() {
    setRate((prevRate) => Math.min(prevRate + 0.1, 10));
  }

  function decreaseRate() {
    setRate((prevRate) => Math.max(prevRate - 0.1, 0.1));
  }

  return (
    <div className="bg-transparent min-h-screen py-8">
      <div className="bg-white shadow-lg rounded-lg p-6 mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">{name}</h1>
        <div className="bg-gray-200 rounded-lg p-4 mb-6">
          <p className="text-lg mb-2">
            <span className="font-bold">Family:</span> {family}
          </p>
          <p className="text-lg mb-2">
            <span className="font-bold">Chef:</span> {chef}
          </p>
          <p className="text-lg mb-2">
            <span className="font-bold">Created at:</span> {new Date(created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center lg:space-x-8">
          <img
            src={photo || placeholderImage}
            alt={name}
            className="w-full lg:w-1/3 mb-4 lg:mb-0 rounded-lg shadow-md"
          />
          <div className="w-full lg:w-2/3">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
              <ul className="list-disc list-inside space-y-2">
                {ingredientList.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Steps</h2>
          <ol className="list-decimal list-inside space-y-2">
            {stepsList.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Categories</h2>
          <ul className="list-inside space-y-2">
            {recipeCategories.length > 0 &&
              recipeCategories.map((category, index) => (
                <li key={index}>{category}</li>
              ))}
          </ul>
        </div>
        <div className="mt-8">
          <div className="flex flex-wrap justify-center items-center space-x-2">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition flex items-center"
              onClick={handleRead}
            >
              <PlayIcon className="w-5 h-5 m-1" />
            </button>
            <button
              className="bg-gray-600 text-white px-4 py-2 rounded-md shadow hover:bg-gray-700 transition flex items-center"
              onClick={handlePause}
            >
              <PauseIcon className="w-5 h-5 m-1" />
            </button>
            <button
              className="bg-gray-600 text-white px-4 py-2 rounded-md shadow hover:bg-gray-700 transition flex items-center"
              onClick={handleResume}
            >
              <ArrowPathIcon className="w-5 h-5 m-1" />
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-700 transition flex items-center"
              onClick={handleStop}
            >
              <StopIcon className="w-5 h-5 m-1" />
            </button>
          </div>
          <div className="flex items-center justify-center space-x-2 mt-4">
            <button
              className="bg-yellow-600 text-white p-1 rounded-md shadow hover:bg-yellow-700 transition flex items-center"
              onClick={decreaseRate}
            >
              <MinusCircleIcon className="w-5 h-5 m-1" />
            </button>
            <span className="text-lg font-semibold">Speed: {rate.toFixed(1)}</span>
            <button
              className="bg-yellow-600 text-white p-1 rounded-md shadow hover:bg-yellow-700 transition flex items-center"
              onClick={increaseRate}
            >
              <PlusCircleIcon className="w-5 h-5 m-1" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RecipeShow;
