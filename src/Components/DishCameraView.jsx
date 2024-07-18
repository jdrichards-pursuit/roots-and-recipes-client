import { useEffect } from "react";
import { DishCamera } from "./DishCamera";

export const DishCameraView = ({ setBurgerToggle, setNewRecipe }) => {
  useEffect(() => {
    setBurgerToggle(false);
  }, []);
  return (
    <div>
      <DishCamera setNewRecipe={setNewRecipe} />
    </div>
  );
};
