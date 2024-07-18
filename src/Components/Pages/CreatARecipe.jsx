import { Info } from "lucide-react";
import { Camera } from "lucide-react";
import { ChevronsRight } from "lucide-react";
import { Link } from "react-router-dom";
import TakePhoto from "../Recipe/TakePhoto"


const CreatARecipe = () => {
  return (
    <div className="border-solid border-2 border-black p-2 items-center text-center text-[#713A3A] bg-[#C7DEF1]">
      <div className="flex justify-between mb-2">
        <h2 className="flex-1">Add a Recipe</h2>
        <div className="ml-4">
          <Info />
        </div>
      </div>
      <TakePhoto />
      <div className="text-center">
        <div className="bg-[#7EB09B] flex justify-center mx-auto w-40">
          <p className="inline-block">Enter Manually</p>
          <Link to={`/recipe_form`}>
            <ChevronsRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreatARecipe;
