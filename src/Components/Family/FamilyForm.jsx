import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../helpers/getUserData";

const URL = import.meta.env.VITE_BASE_URL;

const FamilyForm = () => {
  const [familyName, setFamilyName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [user, setUser] = useState({});

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

  const navigate = useNavigate();

  const generateRandomCode = () => {
    const uuid = uuidv4().replace(/-/g, "");
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let randomCode = "";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * uuid.length);
      const charIndex = parseInt(uuid[randomIndex], 16) % chars.length;
      randomCode += chars[charIndex];
    }
    return randomCode;
  };

  const handleModalChoice = async (choice) => {
    if (choice === "Submit") {
      await handleFamilySubmit();
      navigate(`/family_cookbook`);
    } else {
      setFamilyName("");
      navigate(`/family_cookbook`);
    }
    setShowModal(false);
  };

  const handleInput = (e) => {
    setFamilyName(e.target.value);
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleFamilySubmit = async () => {
    const code = generateRandomCode();
    const formattedFamilyName =
      familyName[0].toUpperCase() + familyName.slice(1);

    const familyEntry = {
      familyName: formattedFamilyName,
      code: code,
      id: user.id,
    };

    await fetch(`${URL}/api/families`, {
      method: "POST",
      body: JSON.stringify(familyEntry),
      headers: { "Content-Type": "application/json" },
    });

    await fetch(
      `${URL}/api/families/codes/update/${code}/${selectedRole}/${user.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      }
    );

    window.location.reload();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (familyName.trim() !== "") {
      setShowModal(true);
    }
  };

  useEffect(() => {
    async function getUser() {
      const user = await getUserData();
      if (user) setUser(user);
    }
    getUser();
  }, []);

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md mx-auto">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Create a Family
      </h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter family name"
          required
          value={familyName}
          onChange={handleInput}
          className="w-full p-4 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-gray-800"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200">
          Submit
        </button>
      </form>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
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
            <div className="flex justify-between">
              <button
                onClick={() => handleModalChoice("Submit")}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200">
                Submit
              </button>
              <button
                onClick={() => handleModalChoice("Cancel")}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyForm;
