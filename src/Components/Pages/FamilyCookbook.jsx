import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserData } from "../../helpers/getUserData";
import JoinFamilyForm from "../Family/JoinFamilyForm";
import FamilyForm from "../Family/FamilyForm";
import recipePlaceHolder from "../../assets/recipe_place_holder.png";

const URL = import.meta.env.VITE_BASE_URL;

const FamilyCookbook = ({ setBurgerToggle }) => {
  const [familyCode, setFamilyCode] = useState("");
  const [user, setUser] = useState("");
  const [familyMembers, setFamilyMembers] = useState([]);
  const [familyName, setFamilyName] = useState("");
  const [familyRecipes, setFamilyRecipes] = useState([]);
  // console.log(user);
  useEffect(() => {
    async function fetchData() {
      // Fetch user data first
      const user = await getUserData();

      // Update state with user data
      if (user) {
        setFamilyCode(user.family_code);
        setUser(user);
      }

      // Fetch families only after user data is set
      const response = await fetch(`${URL}/api/families`);
      const data = await response.json();
      setFamilyName(data.find((f) => f.code === user.family_code).family_name);
    }

    fetchData();
    setBurgerToggle(false);
  }, []);

  useEffect(() => {
    if (familyCode && familyCode !== "000000") {
      fetch(`${URL}/api/families/users/${familyCode}`)
        .then((res) => res.json())
        .then((data) => setFamilyMembers(data));
    }
    if (familyName && familyName !== "defaultFamily") {
      console.log(familyName);
      fetch(`${URL}/api/families/recipes/${familyName}`)
        .then((res) => res.json())
        .then((data) => setFamilyRecipes(data));
    }
  }, [familyName]);

  console.log(familyRecipes);
  // console.log(familyMembers);
  // console.log(familyName);

  return (
    <div>
      {familyCode === "000000" && (
        <>
          <JoinFamilyForm />
          <h2>or</h2>
          <FamilyForm />
        </>
      )}

      {familyMembers.length > 0 && (
        <div className="border-2 border-solid border-black">
          <h1>Members</h1>
          {familyMembers.map((member, index) => {
            return (
              <div key={index}>
                <img
                  src={member.photo}
                  alt="photo"
                  className="w-24 h-24 border-2 border-black rounded-full"
                />
                <h4>{member.nickname || member.first_name}</h4>
              </div>
            );
          })}
        </div>
      )}

      {familyRecipes.length > 0 && (
        <div className="border-2 border-solid border-black mt-4">
          <h1>Family Recipes</h1>
          {familyRecipes.length > 0 &&
            familyRecipes.map((recipe, index) => (
              <Link key={index} to={`/recipe_show/${recipe.id}`}>
                <img
                  src={recipe.photo || recipePlaceHolder}
                  alt="photo"
                  className="w-24 h-24 border-2 border-black rounded-full"
                />
                <h4>{recipe.name}</h4>
                <h4>{recipe.chef}</h4>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default FamilyCookbook;
