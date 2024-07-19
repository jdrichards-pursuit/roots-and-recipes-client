export const handleTagClick = (
  category,
  selectedCategories,
  setSelectedCategories
) => {
  if (selectedCategories.includes(category)) {
    setSelectedCategories(
      selectedCategories.filter(
        (selectedCategory) =>
          selectedCategory.category_name !== category.category_name
      )
    );
  } else {
    setSelectedCategories([...selectedCategories, category]);
  }
};

export const handleTextChange = (event, setNewRecipe, newRecipe) => {
  setNewRecipe({ ...newRecipe, [event.target.id]: event.target.value });
};

// helpers.js

export const handleAddIngredientsInput = (
  setIngredientsInputs,
  ingredientsInputs
) => {
  setIngredientsInputs([...ingredientsInputs, ""]);
};

export const handleIngredientsInputChange = (
  index,
  event,
  setIngredientsInputs,
  ingredientsInputs
) => {
  const newInputs = [...ingredientsInputs];
  newInputs[index] = event.target.value;
  setIngredientsInputs(newInputs);
};

export const handleIngredientDelete = (
  index,
  setIngredientsInputs,
  ingredientsInputs
) => {
  const newIngredientInputs = ingredientsInputs.filter((_, i) => i !== index);
  setIngredientsInputs(newIngredientInputs);
};

export const handleStepsInput = (setStepsInputs, stepsInputs) => {
  setStepsInputs([...stepsInputs, ""]);
};

export const handleStepsInputChange = (
  index,
  event,
  setStepsInputs,
  stepsInputs
) => {
  const newSteps = [...stepsInputs];
  newSteps[index] = event.target.value;
  setStepsInputs(newSteps);
};

export const handleStepDelete = (index, setStepsInputs, stepsInputs) => {
  const newStepInput = stepsInputs.filter((_, i) => i !== index);
  setStepsInputs(newStepInput);
};

export const handlePublicToggle = (
  isPublic,
  setIsPublic,
  newRecipe,
  setNewRecipe
) => {
  setIsPublic(!isPublic);
  setNewRecipe({ ...newRecipe, status: !isPublic ? "TRUE" : "FALSE" });
};
