import { useEffect } from "react";
import { DishCamera } from "./DishCamera";

export const DishCameraView = ({ setNewRecipe, newRecipe }) => {
  // useEffect(() => {
  //   setBurgerToggle(false);
  // }, []);
  return (
    <div>
      <DishCamera setNewRecipe={setNewRecipe} newRecipe={newRecipe} />
    </div>
  );
};
