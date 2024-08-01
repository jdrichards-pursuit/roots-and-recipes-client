import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getUserData } from "../../helpers/getUserData";
import { X, Mic, Plus, Camera } from "lucide-react";

import {
  handleTagClick,
  handleTagEntry,
  handleAddIngredientsInput,
  handleIngredientsInputChange,
  handleIngredientDelete,
  handleStepsInput,
  handleStepsInputChange,
  handleStepDelete,
  handlePublicToggle,
  capitalizeFirstLetter,
} from "../../helpers/helpers";

const URL = import.meta.env.VITE_BASE_URL;

function RecipeForm({ setNewRecipe, newRecipe }) {
  const navigate = useNavigate();
  // user state
  const [userDetails, setUserDetails] = useState(null);
  const [familyName, setFamilyName] = useState(null);
  // State for all categories
  const [categories, setCategories] = useState([]);
  // State for selected categories
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [recipeID, setRecipeID] = useState();
  // STATES FOR THE MODAL
  const [showModal, setShowModal] = useState(false);
  const [modalChoice, setModalChoice] = useState(null);
  // STATE FOR THE INGREDIENTS
  const [ingredientsInputs, setIngredientsInputs] = useState([]);
  // STATE FOR THE STEPS
  const [stepsInputs, setStepsInputs] = useState([]);
  // STATE FOR PUBLIC TOGGLE
  const [isPublic, setIsPublic] = useState(true);
  // New state for checkbox
  const [isSelfChef, setIsSelfChef] = useState(false);
  const [familyID, setFamilyID] = useState(true);
  // STATE FOR RECORDING
  const [recordingIndex, setRecordingIndex] = useState(null);
  const [recordingInputValue, setRecordingInputValue] = useState('');

  const addRecipe = async () => {
    newRecipe.user_id = userDetails.id;
    newRecipe.status = isPublic;
    newRecipe.chef = isSelfChef ? userDetails.nickname : newRecipe.chef;

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

      return data;
    } catch (error) {
      console.error("Error adding recipe:", error);
      throw error; // Rethrow the error for handling in the calling function
    }
  };

  const handleSubmit = async (event) => {
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
        // Handle tag entry with the fetched recipeID
        if (selectedCategories.length > 0) {
          await handleTagEntry(categories, selectedCategories, data.id);
        }

        // Clear local storage after handling tags
        localStorage.removeItem("ingredientsInputs");
        localStorage.removeItem("stepsInputs");
        localStorage.removeItem("newRecipe");
        localStorage.removeItem("photo");
        localStorage.removeItem("selectedCategories");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleTextChange = (event, setNewRecipe, newRecipe) => {
    if (event.target.id === "chef" && isSelfChef) {
      setNewRecipe({
        ...newRecipe,
        chef: userDetails.nickname || userDetails.first_name,
      });
    } else {
      setNewRecipe({ ...newRecipe, [event.target.id]: event.target.value });
    }
  };

  const handleModalChoice = async (choice) => {
    setModalChoice(choice);
    try {
      if (choice === "yes") {
        if (userDetails && userDetails.family_code !== "000000") {
          newRecipe.family_id = familyID.id;
        } else {
          newRecipe.family_id = 1;
        }
        await handleSubmit();
        navigate(`/family_cookbook`);
      } else {
        newRecipe.family_id = 1;
        await handleSubmit();
        navigate(`/cookbook`);
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
    }
    setShowModal(false);
  };

  // HANDLE PUBLIC TOGGLE
  const handlePublicToggleClick = () => {
    handlePublicToggle(isPublic, setIsPublic, newRecipe, setNewRecipe);
  };

  // Use Effect/GET request
  useEffect(() => {
    async function getUser() {
      const user = await getUserData();
      if (user) {
        setUserDetails(user);

        fetch(`${URL}/api/families`)
          .then((res) => res.json())
          .then((data) =>
            setFamilyName(
              data.find((f) => f.code === user.family_code).family_name
            )
          );
        fetch(`${URL}/api/families/id/${user.family_code}`)
          .then((res) => res.json())
          .then((data) => setFamilyID(data))
          .catch((error) => console.error("Error fetching categories:", error));
      }
    }

    getUser();
    fetch(`${URL}/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));

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

  const saveToLocalStorage = () => {
    const updatedRecipe = {
      ...newRecipe,
      status: isPublic,
      family_id: familyID.id,
      photo: newRecipe.photo,
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

  const conditionalSubmit = async (event) => {
    event.preventDefault();
    if (userDetails.family_code === "000000") {
      await handleSubmit();
      navigate("/cookbook");
    } else {
      setShowModal(true);
    }
  };

  // This function is to use the speech recognition API and set up the method to handle the speech recognition
  //https://github.com/jdrichards-pursuit/recipe-speech-to-input/blob/main/src/RecipeForm.jsx
  const startRecognition = (callback, index) => {
    const recognition = new window.webkitSpeechRecognition() || window.SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setRecordingIndex(index);
    };

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      callback(speechResult);
      setRecordingIndex(null);
      setRecordingInputValue('')
    };

    recognition.onerror = () => {
      setRecordingIndex(null);
      setRecordingInputValue('')
    };

    recognition.onend = () => {
      setRecordingIndex(null);
      setRecordingInputValue('')
    };

    recognition.start();
  };

  const handleIngredientSpeechToText = (index) => {
    const newInputs = [...ingredientsInputs];
    startRecognition(
      (text) =>
        newInputs[index] = text, 0,
      setIngredientsInputs(newInputs),
      setRecordingInputValue('ingredient' + index)
    )
  }

  const handleStepsSpeechToText = (index) => {
    const newInputs = [...stepsInputs];
    startRecognition(
      (text) =>
        newInputs[index] = text, 0,
      setStepsInputs(newInputs),
      setRecordingInputValue("step" + index)
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 border border-gray-300 rounded-lg bg-white shadow-md">
      <h1 className="text-center text-3xl font-semibold text-[#713A3A] mb-6">New Recipe</h1>
      <form onSubmit={conditionalSubmit} className="space-y-6">
        {/* Dish Name Input */}
        <div>
          <label className="block text-lg font-medium mb-2">Name of dish</label>
          <input
            id="name"
            value={newRecipe.name || ""}
            type="text"
            onChange={(event) => handleTextChange(event, setNewRecipe, newRecipe)}
            className="w-full border border-gray-300 rounded-lg p-2 shadow-sm"
          />
          <button
            type="button"
            onClick={() =>
              startRecognition(
                (text) => setNewRecipe({ ...newRecipe, name: text }),
                0, setRecordingInputValue('name')
              )
            }
          >
            <Mic className="text-gray-500" />
          </button>
          {recordingIndex === 0 && recordingInputValue === 'name' && <span>🔴</span>}
        </div>

        {/* Chef Input */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="selfChef"
              checked={isSelfChef}
              onChange={() => setIsSelfChef(!isSelfChef)}
              className="mr-2"
            />
            <span>Self</span>
          </label>
          <button
            type="button"
            onClick={() =>
              startRecognition(
                (text) => setNewRecipe({ ...newRecipe, chef: text }),
                0, setRecordingInputValue('chef')
              )
            }
          >
            <Mic className="text-gray-500" />
          </button>
          {recordingIndex === 0 && recordingInputValue === 'chef' && <span>🔴</span>}
          <input
            id="chef"
            value={
              isSelfChef
                ? capitalizeFirstLetter(userDetails?.nickname) ||
                capitalizeFirstLetter(userDetails?.first_name)
                : capitalizeFirstLetter(newRecipe.chef) || ""
            }
            type="text"
            onChange={(event) => handleTextChange(event, setNewRecipe, newRecipe)}
            className="w-full border border-gray-300 rounded-lg p-2 shadow-sm"
          />
        </div>

        {/* Ingredients Input */}
        <div>
          <label className="block text-lg font-medium mb-2">Ingredients</label>
          {ingredientsInputs.map((ingredientInput, index) => (
            <div key={index} className="flex items-center space-x-2 mb-4">
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
                className="w-full border border-gray-300 rounded-lg p-2 shadow-sm"
              />
              <button
                type="button"
                onClick={() => handleIngredientSpeechToText(index)
                }
              >
                <Mic className="text-gray-500" />
              </button>
              {recordingInputValue === 'ingredient' + index && <span>🔴</span>}
              <button
                type="button"
                onClick={() =>
                  handleIngredientDelete(
                    index,
                    setIngredientsInputs,
                    ingredientsInputs
                  )
                }
                className="text-red-500 hover:text-red-700"
              >
                <X />
              </button>
            </div>
          ))}
          {/* PLUS BUTTON */}
          <button
            type="button"
            onClick={() =>
              handleAddIngredientsInput(setIngredientsInputs, ingredientsInputs)
            }
            className="bg-gray-200 text-gray-800 shadow-md border border-gray-300 rounded-lg p-2 flex items-center justify-center"
          >
            <Plus />
          </button>
        </div>

        {/* Steps Input */}
        <div>
          <label className="block text-lg font-medium mb-2">Steps</label>
          {stepsInputs.map((stepInput, index) => (
            <div key={index} className="flex items-center space-x-2 mb-4">
              <input
                onChange={(e) =>
                  handleStepsInputChange(index, e, setStepsInputs, stepsInputs)
                }
                type="text"
                value={stepInput || ""}
                className="w-full border border-gray-300 rounded-lg p-2 shadow-sm"
              />
              <button
                type="button"
                onClick={() => handleStepsSpeechToText(index)
                }
              >
                <Mic className="text-gray-500" />
              </button>
              {recordingInputValue === 'step' + index && <span>🔴</span>}
              <button
                type="button"
                onClick={() => handleStepDelete(index, setStepsInputs, stepsInputs)}
                className="text-red-500 hover:text-red-700"
              >
                <X />
              </button>
            </div>
          ))}
          {/* PLUS BUTTON */}
          <button
            type="button"
            onClick={() => handleStepsInput(setStepsInputs, stepsInputs)}
            className="bg-gray-200 text-gray-800 shadow-md border border-gray-300 rounded-lg p-2 flex items-center justify-center"
          >
            <Plus />
          </button>
        </div>

        {/* CATEGORIES */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.length > 0 &&
            categories.map((category, index) => {
              const isSelected = selectedCategories.includes(
                category.category_name
              );
              return (
                <button
                  key={index}
                  onClick={() =>
                    handleTagClick(
                      category.category_name,
                      selectedCategories,
                      setSelectedCategories
                    )
                  }
                  className={`px-3 py-1 rounded-full text-sm font-medium ${isSelected ? "bg-gray-200" : "bg-gray-100"
                    } border border-gray-300`}
                >
                  #{category.category_name}
                </button>
              );
            })}
        </div>

        {/* Photo Link */}
        <div className="flex items-center space-x-2">
          <Link
            to="/dish_photo"
            onClick={() => {
              saveToLocalStorage();
            }}
            className="flex items-center space-x-2 bg-gray-200 text-gray-800 rounded-lg p-2"
          >
            <p>Take a photo of your dish</p>
            <Camera className="w-6 h-6" />
          </Link>
        </div>

        {/* Public Toggle */}
        <div className="flex items-center space-x-4 mt-4">
          <span className="text-lg">{isPublic ? "Public" : "Private"}</span>
          <div
            onClick={handlePublicToggleClick}
            className={`w-16 h-8 flex items-center rounded-full p-1 cursor-pointer ${isPublic ? "bg-blue-600" : "bg-gray-300"
              }`}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform ${isPublic ? "translate-x-8" : ""
                } transition-transform duration-300`}
            />
          </div>
        </div>

        {/* Submit/Save Button */}
        <div className="flex justify-between mt-8 space-x-2">
          <input
            type="submit"
            value="Save"
            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-4 py-2 shadow-md w-1/2"
          />
          <button
            onClick={() => navigate(-1)}
            className="bg-red-400 hover:bg-red-500 text-white rounded-lg px-4 py-2 shadow-md w-1/2"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4 text-lg">Would you like to add this recipe to your family?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleModalChoice("yes")}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => handleModalChoice("no")}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipeForm;
