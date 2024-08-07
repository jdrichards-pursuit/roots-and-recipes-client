import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserData } from "../../helpers/getUserData";
import JoinFamilyForm from "../Family/JoinFamilyForm";
import FamilyForm from "../Family/FamilyForm";
import recipePlaceHolder from "../../assets/recipe_place_holder.png";

const URL = import.meta.env.VITE_BASE_URL;

const FamilyCookbook = () => {
  const [familyCode, setFamilyCode] = useState("");
  const [user, setUser] = useState("");
  const [familyMembers, setFamilyMembers] = useState([]);
  const [familyName, setFamilyName] = useState("");
  const [familyRecipes, setFamilyRecipes] = useState([]);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalChoice, setModalChoice] = useState("");

  const navigate = useNavigate();

  console.log(user);
  useEffect(() => {
    async function fetchData() {
      const user = await getUserData();
      if (user) {
        setFamilyCode(user.family_code);
        setUser(user);
      }

      const response = await fetch(`${URL}/api/families`);
      const data = await response.json();
      setFamilyName(data.find((f) => f.code === user.family_code).family_name);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (familyCode && familyCode !== "000000") {
      fetch(`${URL}/api/families/users/${familyCode}`)
        .then((res) => res.json())
        .then((data) => setFamilyMembers(data));
    }
    if (familyName && familyName !== "defaultFamily") {
      fetch(`${URL}/api/families/recipes/${familyName}`)
        .then((res) => res.json())
        .then((data) => setFamilyRecipes(data));
    }
  }, [familyName]);

  const handleLeaveFamily = () => {
    if (user.owner) {
      setShowOwnerModal(true);
    } else {
      setShowModal(true);
    }
  };

  const handleOwnerModalChoice = async (choice) => {
    setModalChoice(choice);
    try {
      if (choice === "Reassign Owner") {
        navigate(`/family_members`);
      } else {
        await fetch(
          `${URL}/api/families/delete/${user.family_code}/${user.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        await fetch(`${URL}/api/families/delete/${user.family_code}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        navigate(`/home`);
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
    }
    setShowOwnerModal(false);
  };

  const handleModalChoice = async (choice) => {
    setModalChoice(choice);
    try {
      if (choice === "yes") {
        await fetch(`${URL}/api/families/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });
        navigate("/home");
      } else {
        navigate(`/family_cookbook`);
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
    }
    setShowModal(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(familyCode);
    alert("Family Code copied to clipboard!");
  };

  console.log(familyMembers);
  return (
    <div className="flex justify-center items-center mt-2 w-full">
      <div className="bg-white/30 backdrop-blur-md p-6 rounded-lg shadow-lg w-full max-w-4xl ">
        {familyCode === "000000" ? (
          <div className="flex flex-col items-center md:flex-row md:justify-center md:gap-8 ">
            <div className="flex-1 max-w-md mb-8 md:mb-0">
              <FamilyForm />
            </div>
            <div className="flex items-center mb-8 md:mb-0">
              <h2 className="text-2xl font-bold">or</h2>
            </div>
            <div className="flex-1 max-w-md mb-8 md:mb-0">
              <JoinFamilyForm />
            </div>
          </div>
        ) : (
          <button
            onClick={handleLeaveFamily}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 text-[15px] rounded absolute mt-9 ml-2">
            Leave Family
          </button>
        )}

        {familyMembers.length > 0 && (
          <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
            <h1 className="text-3xl font-bold text-center mb-6 pt-[100px]">
              {familyName}'s Family Cookbook
            </h1>
            <h3 className="text-sm font-bold text-center mb-6 absolute right-10 top-14 mt-2 ml-[100px]">
              Family Code:{" "}
              <span
                onClick={copyToClipboard}
                className="text-blue-600 underline cursor-pointer">
                {familyCode}
              </span>
            </h3>
            <h2 className="text-2xl font-semibold mb-4">Members</h2>
            <div className="flex flex-wrap justify-center">
              {familyMembers.map((member, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center m-4 p-4 bg-gray-100 rounded-lg shadow-md">
                  {member.owner && (
                    <h3 className="absolute text-xs -mt-3">Owner</h3>
                  )}
                  <img
                    src={member.photo}
                    alt="photo"
                    className="w-24 h-24 border-2 border-gray-300 rounded-full mb-3 mt-3"
                  />
                  <h4 className="text-lg font-medium">
                    {user.first_name.split(" ")[0] &&
                    member.first_name.split(" ")[0] ===
                      user.first_name.split(" ")[0]
                      ? "You"
                      : member.nickname || member.first_name.split(" ")[0]}
                  </h4>
                  <h3 className="-mt-3">{member.role}</h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {familyRecipes.length > 0 && (
          <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
            <h2 className="text-2xl font-semibold mb-4">Family Recipes</h2>
            <div className="flex flex-wrap justify-center">
              {familyRecipes.map((recipe, index) => (
                <Link
                  key={index}
                  to={`/recipe_show/${recipe.id}`}
                  className="flex flex-col items-center m-4 p-4 bg-gray-100 rounded-lg shadow-md">
                  <img
                    src={recipe.photo || recipePlaceHolder}
                    alt="recipe"
                    className="w-24 h-24 border-2 border-gray-300 rounded-full mb-2"
                  />
                  <h4 className="text-lg font-medium">{recipe.name}</h4>
                  <h4 className="text-sm text-gray-600">{recipe.chef}</h4>
                </Link>
              ))}
            </div>
          </div>
        )}

        {showOwnerModal && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-white p-5 rounded-lg shadow-lg text-center max-w-md w-full">
              <p className="mb-3">
                Would you like to delete your family or give another user
                ownership of the group?
              </p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => handleOwnerModalChoice("Reassign Owner")}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                  Reassign Owner
                </button>
                <button
                  onClick={() => handleOwnerModalChoice("Delete Family")}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                  Delete Family
                </button>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-white p-5 rounded-lg shadow-lg text-center">
              <p className="mb-3">
                Are you sure you want to leave your family?
              </p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => handleModalChoice("yes")}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                  Yes
                </button>
                <button
                  onClick={() => handleModalChoice("no")}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyCookbook;
