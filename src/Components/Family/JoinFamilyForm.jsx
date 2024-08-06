import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../helpers/getUserData";

const URL = import.meta.env.VITE_BASE_URL;

const JoinFamilyForm = () => {
  const [allFamilyCodes, setAllFamilyCodes] = useState([]);
  const [familyCodeInput, setFamilyCodeInput] = useState("");
  const [user, setUser] = useState({});
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
    "Daughter",
    "Son",
  ];

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
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
    e.preventDefault();
    if (
      allFamilyCodes.some((code) => code.family_code === familyCodeInput) &&
      familyCodeInput !== "000000"
    ) {
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
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => console.log(data))
        .catch((error) => console.error("Fetch error:", error));
      setModal(false);
      navigate(`/family_cookbook`);
      window.location.reload();
    } else {
      alert("INVALID FAMILY CODE");
    }
  };

  const handleJoinFamilyChange = (e) => {
    setFamilyCodeInput(e.target.value);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md mx-auto">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Join a Family
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (
            allFamilyCodes.some((code) => code.family_code === familyCodeInput)
          ) {
            setModal(true);
          } else {
            setFamilyCodeInput("");
            alert("INVALID FAMILY CODE");
          }
        }}>
        <input
          type="text"
          value={familyCodeInput}
          placeholder="Enter Family Code"
          onChange={handleJoinFamilyChange}
          className="w-full p-4 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-gray-800"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200">
          Submit
        </button>
      </form>
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <div className="text-center">
              {user.nickName === "" && (
                <input
                  type="button"
                  value="NickName"
                  onClick={() => handleModalNickNameInput()}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg cursor-pointer mb-4"
                />
              )}
              <form onSubmit={handleJoinFamily}>
                <label
                  htmlFor="family-roles"
                  className="block mb-4 text-xl font-bold text-gray-700">
                  Select Your Family Role:
                </label>
                <select
                  id="family-roles"
                  value={selectedRole}
                  onChange={handleRoleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="" disabled>
                    Select a role
                  </option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinFamilyForm;
