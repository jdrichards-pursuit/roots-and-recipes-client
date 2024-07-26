import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../helpers/getUserData";
const URL = import.meta.env.VITE_BASE_URL;

const JoinFamilyForm = () => {
  const [allFamilyCodes, setAllFamilyCodes] = useState([]);
  const [familyCodeInput, setFamilyCodeInput] = useState("");
  const [user, setUser] = useState("");
  const [modal, setModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();

  const roles = [
    "Sibling",
    "Parent",
    "Grandparent",
    "Child",
    "Grandchild",
    "Aunt",
    "Uncle",
    "Nephew",
    "Niece",
    "Cousin",
    "In-law",
    "Spouse",
    "Partner",
  ];

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
    console.log(event.target.value);
  };

  useEffect(() => {
    fetch(`${URL}/api/families/codes`)
      .then((res) => res.json())
      .then((data) => setAllFamilyCodes(data))
      .catch((error) => console.error(error));

    async function getUser() {
      const user = await getUserData();
      if (user) setUser(user);
    }
    getUser();
  }, []);

  const handleJoinFamily = (e) => {
    // e.preventDefault();
    //check if the code state exists already within all the family code (fetch for all family codes and put that into allFamilyCodes)
    if (
      allFamilyCodes.some((code) => code.family_code === familyCodeInput) &&
      familyCodeInput !== "000000"
    ) {
      //send a Update method fetch that updates the users family code to the code theyve inputted.
      // Send a PUT request to update the user's family code
      fetch(
        `${URL}/api/families/codes/update/${familyCodeInput}/${selectedRole}/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          // Check if response is OK
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          // Return JSON response
          return res.json();
        })
        .then((data) => console.log(data))
        .catch((error) => console.error("Fetch error:", error));
    }

    //set modal toggle to true that will ask user for nickname (check if the user already has a nickname first) and role in family (probably have to add a role value to the users table)
    //navigate to family cookbook page again, only this time because the fetch updated the family code, when the page refreshes it will show the updated family cookbook screen
  };

  const handleJoinFamilyChange = (e) => {
    setFamilyCodeInput(e.target.value);
  };

  return (
    <>
      <h1>Join a family</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log(user);
          setModal(true);
        }}>
        <input
          type="text"
          name="code"
          id="code"
          placeholder="Enter Family Code"
          onChange={handleJoinFamilyChange}
        />
        <button>Submit</button>
      </form>
      {modal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg text-center">
            <div className="flex justify-center">
              {user.nickName === "" && (
                <input
                  type="button"
                  value="NickName"
                  onClick={() => handleModalNickNameInput()}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2 cursor-pointer"
                />
              )}
              <form onSubmit={handleJoinFamily}>
                <label
                  htmlFor="family-roles"
                  className="block mb-2 text-lg font-bold">
                  Select Your Family Role:
                </label>
                <select
                  id="family-roles"
                  value={selectedRole}
                  onChange={handleRoleChange}
                  className="bg-white border border-gray-300 rounded-md p-2">
                  <option value="" disabled>
                    Select a role
                  </option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <button> submit </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JoinFamilyForm;
