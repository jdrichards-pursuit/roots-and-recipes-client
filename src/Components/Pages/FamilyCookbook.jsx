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
  }, []);

  useEffect(() => {
    if (familyCode && familyCode !== "000000") {
      fetch(`${URL}/api/families/users/${familyCode}`)
        .then((res) => res.json())
        .then((data) => setFamilyMembers(data));
    }
    if (familyName && familyName !== "defaultFamily") {
      // console.log(familyName);
      fetch(`${URL}/api/families/recipes/${familyName}`)
        .then((res) => res.json())
        .then((data) => setFamilyRecipes(data));
    }
  }, [familyName]);

  // console.log(familyRecipes);
  // console.log(familyMembers);
  // console.log(familyName);
  console.log(user);

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
        //delete family from db fetch using the family code.
        fetch(`${URL}/api/families/delete/${user.family_code}/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json());
        fetch(`${URL}/api/families/delete/${user.family_code}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json());
        // console.log(user);
        navigate(`/home`);
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
    }
    setShowOwnerModal(false); // Close modal after choice
  };

  const handleModalChoice = async (choice) => {
    setModalChoice(choice);
    try {
      if (choice === "yes") {
        //leave family fetch
        fetch(`${URL}/api/families/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json());
        navigate("/home");
      } else {
        navigate(`/family_cookbook`);
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
    }
    setShowModal(false); // Close modal after choice
  };

  return (
    <div className="container mx-auto p-4">
      {familyCode === "000000" ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <JoinFamilyForm />
          <h2 className="text-2xl font-bold my-4">or</h2>
          <FamilyForm />
        </div>
      ) : (
        <button
          onClick={handleLeaveFamily}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Leave Family
        </button>
      )}

      {familyMembers.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
          <h1 className="text-3xl font-bold text-center mb-6">
            {familyName}'s Family Cookbook
          </h1>
          <h2 className="text-2xl font-semibold mb-4">Members</h2>
          <div className="flex flex-wrap justify-center">
            {familyMembers.map((member, index) => (
              <div
                key={index}
                className="flex flex-col items-center m-4 p-4 bg-gray-100 rounded-lg shadow-md"
              >
                <img
                  src={member.photo}
                  alt="photo"
                  className="w-24 h-24 border-2 border-gray-300 rounded-full mb-2"
                />
                <h4 className="text-lg font-medium">
                  {member.nickname || member.first_name}
                </h4>
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
                className="flex flex-col items-center m-4 p-4 bg-gray-100 rounded-lg shadow-md"
              >
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
          <div className="bg-white p-5 rounded-lg shadow-lg text-center">
            <p className="mb-3">
              Would you like to delete your family or give another user
              ownership of the group?
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => handleOwnerModalChoice("Reassign Owner")}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Reassign Owner
              </button>
              <button
                onClick={() => handleOwnerModalChoice("Delete Family")}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-2"
              >
                Delete Family
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg text-center">
            <p className="mb-3">Are you sure you want to leave your family?</p>
            <div className="flex justify-center">
              <button
                onClick={() => handleModalChoice("yes")}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2"
              >
                yes
              </button>
              <button
                onClick={() => handleModalChoice("no")}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-2"
              >
                no
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyCookbook;
