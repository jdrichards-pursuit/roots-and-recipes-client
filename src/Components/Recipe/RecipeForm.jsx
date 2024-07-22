import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getUserData } from "../../helpers/getUserData";
import { X } from "lucide-react";
import { Mic } from "lucide-react";
import { Plus } from "lucide-react";
import { data } from "autoprefixer";
import {
  handleTagClick,
  handleTagEntry,
  handleTextChange,
  handleAddIngredientsInput,
  handleIngredientsInputChange,
  handleIngredientDelete,
  handleStepsInput,
  handleStepsInputChange,
  handleStepDelete,
  handlePublicToggle,
} from "../../helpers/helpers";

const URL = import.meta.env.VITE_BASE_URL;

function RecipeForm({ setNewRecipe, newRecipe }) {
  const navigate = useNavigate();

  // user state
  const [userDetails, setUserDetails] = useState(null);
  const [familyName, setFamilyName] = useState(null);

  // console.log(userDetails);
  //State for all categories
  const [categories, setCategories] = useState([]);
  //State for selected categories
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [recipeID, setRecipeID] = useState();

  // STATES FOR THE MODAL
  const [showModal, setShowModal] = useState(false);
  const [modalChoice, setModalChoice] = useState(null);

  // // STATE FOR THE INGREDIENTS
  const [ingredientsInputs, setIngredientsInputs] = useState([]);
  // STATE FOR THE STEPS
  const [stepsInputs, setStepsInputs] = useState([]);

  // STATE FOR PUBLIC TOGGLE
  const [isPublic, setIsPublic] = useState(true);

  const addRecipe = async () => {
    // console.log(userDetails);
    newRecipe.user_id = userDetails.id;
    newRecipe.status = isPublic;
    // console.log(localStorage.getItem("updatedRecipe"));
    // newRecipe.photo = localStorage.getItem("updatedRecipes.photo");
    try {
      const response = await fetch(`${URL}/api/recipes`, {
        method: "POST",
        body: JSON.stringify(newRecipe),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to add recipe");
      }

      const data = await response.json();
      console.log(data);

      // setNewRecipe(data); // Assuming you want to update the state with the new recipe

      // Navigate based on modalChoice
      if (modalChoice === "yes") {
        navigate(`family_cookbook`);
      } else {
        navigate(`/cookbook`);
      }

      return data; // Return the added recipe or necessary data
    } catch (error) {
      console.error("Error adding recipe:", error);
      throw error; // Rethrow the error for handling in the calling function
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Wait for addRecipe to complete
      await addRecipe();

      // Fetch the latest recipe after adding
      if (userDetails) {
        const response = await fetch(
          `${URL}/api/recipes/latest/${userDetails.id}`
        );
        const data = await response.json();
        setRecipeID(data.id);
        // console.log(data);

        // Handle tag entry with the fetched recipeID
        if (selectedCategories.length > 0) {
          await handleTagEntry(categories, selectedCategories, data.id);
        }
      }

      // Clear local storage after handling tags
      localStorage.removeItem("ingredientsInputs");
      localStorage.removeItem("stepsInputs");
      localStorage.removeItem("newRecipe");
      localStorage.removeItem("photo");

      // Show the modal after everything is done
      setShowModal(true);
    } catch (error) {
      console.error("Error:", error);
      // Handle the error appropriately (e.g., show a message to the user)
    }
  };

  // Handle modal choice function
  const handleModalChoice = (choice) => {
    setModalChoice(choice);
    setShowModal(false); // Close modal after choice
    // addRecipe(); // Proceed to add recipe after user's choice
  };

  // HANDLE PUBLIC TOGGLE
  const handlePublicToggleClick = () => {
    handlePublicToggle(isPublic, setIsPublic, newRecipe, setNewRecipe);
  };

  // Use Effect
  useEffect(() => {
    async function getUser() {
      const user = await getUserData();
      if (user) {
        setUserDetails(user);
        // setNewRecipe({
        //   name: "",
        //   family: "",
        //   chef: "",
        //   status: "TRUE",
        //   user_id: user.id,
        //   photo: "",
        //   ingredients: "",
        //   steps: "",
        // });
        fetch(`${URL}/api/families`)
          .then((res) => res.json())
          .then((data) =>
            setFamilyName(
              data.find((f) => f.code === user.family_code).family_name
            )
          );
      }
    }

    fetch(`${URL}/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));

    getUser();

    // Restore ingredientsInputs and stepsInputs from localStorage
    const storedIngredients =
      JSON.parse(localStorage.getItem("ingredientsInputs")) || [];
    const storedSteps = JSON.parse(localStorage.getItem("stepsInputs")) || [];
    const storedRecipe = JSON.parse(localStorage.getItem("newRecipe")) || [];
    const storedSelectedCategories =
      JSON.parse(localStorage.getItem("selectedCategories")) || [];

    setIngredientsInputs(storedIngredients);
    setStepsInputs(storedSteps);
    setNewRecipe(storedRecipe);
    setSelectedCategories(storedSelectedCategories);

    // Clean up localStorage if newRecipe name is empty
    if (newRecipe.name === "") {
      localStorage.removeItem("ingredientsInputs");
      localStorage.removeItem("stepsInputs");
      localStorage.removeItem("newRecipe");
      localStorage.removeItem("photo");
      localStorage.removeItem("selectedCategories");
    }
  }, []);

  // useEffect(() => {
  //   if (userDetails && userDetails.family_code !== "000000") {
  //     setNewRecipe((prevRecipe) => ({
  //       ...prevRecipe,
  //       family: familyName,
  //     }));
  //   }
  // }, []);

  const saveToLocalStorage = () => {
    const updatedRecipe = {
      ...newRecipe,
      status: isPublic,
      photo: newRecipe.photo,
      family: familyName,
    };
    localStorage.setItem("newRecipe", JSON.stringify(updatedRecipe));
    localStorage.setItem(
      "ingredientsInputs",
      JSON.stringify(ingredientsInputs)
    );
    localStorage.setItem("stepsInputs", JSON.stringify(stepsInputs));
    localStorage.setItem(
      "selectedCategories",
      JSON.stringify(selectedCategories)
    );
  };
  // GIVE THE INGREDIENTS KEY A VALUE BY JOINING THE ARRAY INTO ONE STRING
  newRecipe.ingredients = ingredientsInputs.join(",");
  // GIVE THE STEPS KEY A VALUE BY JOINING THE ARRAY INTO ONE STRING
  newRecipe.steps = stepsInputs.join(",");
  newRecipe.family = familyName;

  // console.log("NEW RECIPE", newRecipe);
  console.log(selectedCategories);
  return (
    <div className="ml-28 border-2 border-black border-solid">
      <h1 className="text-center text-[#713A3A]">New Recipe</h1>
      <form onSubmit={handleSubmit}>
        {/* Dish Name Input */}
        <label>
          <h2>Name of dish</h2>
        </label>
        <input
          id="name"
          value={newRecipe.name || ""}
          type="text"
          onChange={(event) => handleTextChange(event, setNewRecipe, newRecipe)}
          placeholder="Name of dish"
          // required
          className="shadow-md border-2 border-black hover:bg-white bg-zinc-100 rounded-lg py-2 px-3"
        />

        {/* Family name input (DO WE NEED THIS? BRING THIS UP)*/}
        {/* {userDetails && userDetails.family_code === "000000" && (
          <>
            <label>
              <h2>Family</h2>
            </label>
            <input
              id="family"
              value={newRecipe.family || ""}
              type="text"
              onChange={(event) =>
                handleTextChange(event, setNewRecipe, newRecipe)
              }
              placeholder="Family"
              // required
              className="shadow-md border-2 border-black hover:bg-white bg-zinc-100 rounded-lg py-2 px-3"
            />
          </>
        )} */}

        {/* Chef Input (if needed) */}
        <label>
          <h2>Chef</h2>
        </label>
        <input
          id="chef"
          value={newRecipe.chef || ""}
          type="text"
          onChange={(event) => handleTextChange(event, setNewRecipe, newRecipe)}
          placeholder="Chef"
          className="shadow-md border-2 border-black hover:bg-white bg-zinc-100 rounded-lg py-2 px-3"
        />

        {/* Ingredients Input */}
        <label>
          <h2>Ingredients</h2>
        </label>

        {ingredientsInputs.map((ingredientInput, index) => {
          return (
            <div key={index}>
              <input
                onChange={(e) =>
                  handleIngredientsInputChange(
                    index,
                    e,
                    setIngredientsInputs,
                    ingredientsInputs
                  )
                }
                type="text"
                value={ingredientInput || ""}
                className="border-solid border-2 border-black p-2 mt-8"
              />
              <div
                onClick={() =>
                  handleIngredientDelete(
                    index,
                    setIngredientsInputs,
                    ingredientsInputs
                  )
                }>
                <X />
              </div>
            </div>
          );
        })}

        {/* PLUS BUTTON */}
        <div
          onClick={() =>
            handleAddIngredientsInput(setIngredientsInputs, ingredientsInputs)
          }
          className="ml-28 bg-zinc-100 text-black shadow-md border-2 border-black rounded-lg py-1 px-2 w-8 h-8 flex items-center justify-center">
          <Plus />
        </div>

        {/* Steps Input */}
        <label>
          <h2>Steps</h2>
        </label>
        {stepsInputs.map((stepInput, index) => {
          return (
            <div key={index}>
              <div className="flex items-center space-x-2 mt-8">
                <input
                  onChange={(e) =>
                    handleStepsInputChange(
                      index,
                      e,
                      setStepsInputs,
                      stepsInputs
                    )
                  }
                  type="text"
                  value={stepInput || ""}
                  className="border-solid border-2 border-black p-2 mt-8"
                />

                <Mic className="mt-8" />
              </div>

              <div
                onClick={() =>
                  handleStepDelete(index, setStepsInputs, stepsInputs)
                }>
                <X />
              </div>
            </div>
          );
        })}

        {/* PLUS BUTTON */}

        <div
          onClick={() => handleStepsInput(setStepsInputs, stepsInputs)}
          className="ml-28 bg-zinc-100 text-black shadow-md border-2 border-black rounded-lg py-1 px-2 w-8 h-8 flex items-center justify-center">
          <Plus />
        </div>

        {/* CATEGORIES */}
        <div>
          {categories.length > 0 &&
            categories.map((category, index) => {
              const isSelected = selectedCategories.includes(
                category.category_name
              );
              return (
                <p
                  key={index}
                  onClick={() =>
                    handleTagClick(
                      category.category_name,
                      selectedCategories,
                      setSelectedCategories
                    )
                  }
                  className={`inline-block px-2 py-1 rounded-full ${
                    isSelected ? "bg-gray-200" : ""
                  }`}>
                  #{category.category_name}
                </p>
              );
            })}
        </div>

        {/* Public Toggle */}

        {/* Public Toggle */}
        <div className="flex justify-center items-center mt-4">
          <span className="mr-3">{isPublic ? "Public" : "Private"}</span>
          <div
            onClick={handlePublicToggleClick}
            className={`w-16 h-8 flex items-center rounded-full p-1 cursor-pointer ${
              isPublic ? "bg-[#3A00E5]" : "bg-gray-300"
            }`}>
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform ${
                isPublic ? "translate-x-8" : ""
              } transition-transform duration-300`}
            />
          </div>
        </div>

        {/* Submit/Save Button */}
        <div className="flex justify-between mt-10">
          <input
            type="submit"
            value="Save"
            className="bg-emerald-500 hover:bg-green-500 rounded-lg px-1 py-0 shadow-md w-1/2 mb-10 ml-2"
          />
          <p
            onClick={() => navigate(-1)}
            className="bg-red-400 hover:bg-red-500 rounded-lg px-1 py-0 shadow-md w-1/2 mb-10 ml-2">
            Cancel
          </p>
        </div>
      </form>

      {/* MODAL */}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg text-center">
            <p className="mb-3">
              Would you like to add this recipe to your family?
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => handleModalChoice("yes")}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2">
                Yes
              </button>
              <button
                onClick={() => handleModalChoice("no")}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-2">
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <Link
        to="/dish_photo"
        onClick={() => {
          saveToLocalStorage();
        }}>
        <p>Take Photo of dish, maybe camera emoji </p>
      </Link>
    </div>
  );
}

export default RecipeForm;
