
import { ChevronsRight } from "lucide-react";
import { Link } from "react-router-dom";
import TakePhoto from "../Recipe/TakePhoto"


const CreatARecipe = () => {
  return (
    <div>
      <div className="border-solid border-2 border-black p-2 items-center text-center text-[#713A3A] bg-[#FFEFB9] rounded-2xl">
        <TakePhoto />
      </div>
      <br />
      <div className="text-center">
        <Link to={`/recipe_form`}>
          <div className="bg-[#C7DEF1] flex justify-center mx-auto w-80 border-solid border-2 border-black rounded-xl flex-row justify-between p-2">
            <p>Enter Manually </p><ChevronsRight />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CreatARecipe;
