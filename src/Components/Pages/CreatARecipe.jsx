import { Info } from "lucide-react";
import { Camera } from "lucide-react";
import { ChevronsRight } from "lucide-react";
import { Link } from "react-router-dom";

const CreatARecipe = () => {
  return (
    <div className="border-solid border-2 border-black p-2 items-center text-center text-[#713A3A] bg-[#C7DEF1]">
      <div className="flex justify-between mb-2">
        <h2 className="flex-1">Add a Recipe</h2>
        <div className="ml-4">
          <Info />
        </div>
      </div>
      <p className="text-black">
        Lorem ipsum dolor sit amet consectetur. Suspendisse.
      </p>

      <h3>Upload a Recipe</h3>
      <p className="bg-[#D9D9D9] w-48 ml-20 h-8 ">+</p>
      <h3>Take a Picture</h3>
      <div className="bg-[#D9D9D9] flex  justify-center w-48 ml-20 h-full">
        <Camera />
      </div>
      <div className="text-center">
        <p className="inline-block">or enter manually</p>
        <div className="bg-[#7EB09B] flex justify-center mx-auto w-40">
          <Link to={`/recipe_form`}>
            <ChevronsRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreatARecipe;
