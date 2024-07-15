import { useState, useEffect } from "react";

function RecipeForm({ setBurgerToggle }) {
  useEffect(() => {
    setBurgerToggle(false);
  }, []);

  return <div>RecipeForm</div>;
}

export default RecipeForm;
