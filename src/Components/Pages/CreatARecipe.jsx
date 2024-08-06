import { ChevronsRight } from "lucide-react";
import { Link } from "react-router-dom";
import TakePhoto from "../Recipe/TakePhoto";

const CreatARecipe = () => {
  return (
    <div className="flex flex-col items-center min-h-screen py-8">
      <div className="bg-[#FFDAB9] bg-opacity-90 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-lg">
        <TakePhoto />
      </div>
      <div className="mt-10">
        <Link to={`/recipe_form`}>
          <div className="bg-blue-600 flex items-center justify-between mx-auto w-80 border-2 rounded-xl p-3 shadow-lg transition-all duration-200  bg-blue-600font-semibold py-3 rounded-lg hover:bg-blue-700">
            <p className="text-white font-semibold">Enter Manually</p>
            <ChevronsRight className="text-white" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CreatARecipe;
