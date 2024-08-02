import { ChevronsRight } from "lucide-react";
import { Link } from "react-router-dom";
import TakePhoto from "../Recipe/TakePhoto";

const CreatARecipe = () => {
  return (
    <div className="flex flex-col items-center min-h-screen py-8">
      <div className="bg-[#FFDAB9] p-4 text-center text-[#713A3A] rounded-lg shadow-lg w-full max-w-md">
        <TakePhoto />
      </div>
      <div className="mt-8">
        <Link to={`/recipe_form`}>
          <div className="bg-[#C7DEF1] flex items-center justify-between mx-auto w-80 border-2 border-[#713A3A] rounded-xl p-2 shadow-lg transition-transform transform hover:scale-105">
            <p className="text-[#713A3A] font-medium">Enter Manually</p>
            <ChevronsRight className="text-[#713A3A]" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CreatARecipe;
