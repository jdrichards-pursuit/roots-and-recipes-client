import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserData } from "../../helpers/getUserData";
import placeholderImage from "../../assets/recipe_place_holder.png";

const URL = import.meta.env.VITE_BASE_URL;

const RecipeShow = () => {
  const { id } = useParams();
  const [rate, setRate] = useState(1);

  //  STATE TO STORE THE RECIPE
  const [singleRecipe, setSingleRecipe] = useState(null);
  const [recipeCategories, setRecipeCategories] = useState([]);
  const [user, setUser] = useState({});
  const [familyName, setFamilyName] = useState("");
  // had to change the initial state from being empty to null. i guess to let it be known there will be something there soon or to indicate "loading state"

  // console.log(singleRecipe);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data and wait for it to complete
        const user = await getUserData();
        if (user) setUser(user);

        // Fetch single recipe and wait for it to complete
        const recipeResponse = await fetch(
          `${URL}/api/recipes/single_recipe/${id}`
        );
        const recipeData = await recipeResponse.json();
        setSingleRecipe(recipeData);

        // Fetch recipe categories and wait for it to complete
        const categoriesResponse = await fetch(
          `${URL}/api/categories/recipes/${id}`
        );
        const categoriesData = await categoriesResponse.json();
        setRecipeCategories(categoriesData.map((elem) => elem.category_name));

        // Fetch family name by family id only if user id is available
        if (user?.id) {
          const familyResponse = await fetch(
            `${URL}/api/families/name/${user.id}`
          );
          const familyData = await familyResponse.json();
          setFamilyName(familyData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  // I had to add the id to the dependency array to get rid of the error i was receiving when refreshing the page
  // This dependency array includes 'id' to refetch data if the 'id' changes
  console.log(singleRecipe);
  if (!singleRecipe) {
    return <div>Loading...</div>;
  }

  // Destructure the properties from the singleRecipe object
  const { name, ingredients, chef, family_id, created_at, photo, steps } =
    singleRecipe;

  // Split ingredients and steps into arrays
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

    // console.log("Reading ingredients and instructions");
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

  // Stop the speech
  function handleStop() {
    window.speechSynthesis.cancel();
  }
  // Increase the rate of speech, you must press stop if you want to adjust the speed and the recording is already playing. Then press play again.
  function increaseRate() {
    setRate((prevRate) => Math.min(prevRate + 0.1, 10)); // Max rate is 10
  }

  // Decrease the rate of speech, you must press stop if you want to adjust the speed and the recording is already playing. Then press play again.
  function decreaseRate() {
    setRate((prevRate) => Math.max(prevRate - 0.1, 0.1)); // Min rate is 0.1
  }

  return (
    <div className="p-4 bg-[#C7DEF1] rounded-lg shadow-lg">
      <div className="bg-white rounded-md p-4 mb-3">
        <h1 className="text-2xl font-bold mb-4 text-center">{name}</h1>
        <img
          src={photo || placeholderImage}
          alt={name}
          className="mb-4 shadow-xl"
        />
        <p className="text-lg mb-2">Chef: {chef}</p>
        {family_id !== 1 &&
          familyName.length > 0 &&
          familyName !== "defaultFamily" && (
            <p className="text-lg mb-2 font-bold">
              Family:
              <span className="font-thin"> {familyName}</span>
            </p>
          )}
        <p className="text-lg mb-2">
          Created at: {new Date(created_at).toLocaleDateString()}
        </p>
      </div>
      <div className="bg-white shadow-lg rounded-md p-4">
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
      <div>
        <button style={{ width: "160px", height: "40px" }} onClick={handleRead}>
          Play Recipe
        </button>
        <button onClick={handlePause}>Pause</button>
        <button onClick={handleResume}>Resume</button>
        <button onClick={handleStop}>Stop</button>
        <div>
          <button onClick={decreaseRate}>-</button>
          <span> Speed: {rate.toFixed(1)} </span>
          <button onClick={increaseRate}>+</button>
        </div>
      </div>
    </div>
  );
};

export default RecipeShow;
