import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../helpers/getUserData";

const URL = import.meta.env.VITE_BASE_URL;

const FamilyForm = () => {
  const [familyName, setFamilyName] = useState("");
  const [familyEntry, setFamilyEntry] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalChoice, setModalChoice] = useState(false);
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
  ];

  const navigate = useNavigate();

  const generateRandomCode = () => {
    const uuid = uuidv4().replace(/-/g, ""); // Remove hyphens
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
    setModalChoice(choice);
    try {
      if (choice === "Submit") {
        await handleFamilySubmit();
        navigate(`/family_cookbook`);
      } else {
        setFamilyName("");
        navigate(`/family_cookbook`);
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
    }
    setShowModal(false); // Close modal after choice
  };

  const handleInput = (e) => {
    setFamilyName(e.target.value);
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleFamilySubmit = () => {
    const code = generateRandomCode();
    const formattedFamilyName =
      familyName[0].toUpperCase() + familyName.slice(1);

    // Constructing the familyEntry object
    const familyEntry = {
      familyName: formattedFamilyName,
      code: code,
      id: user.id,
    };

    // POST request to create the family
    fetch(`${URL}/api/families`, {
      method: "POST",
      body: JSON.stringify(familyEntry),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .catch((error) => console.error("Fetch error:", error));

    fetch(
      `${URL}/api/families/codes/update/${code}/${selectedRole}/${user.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .catch((error) => console.error("Fetch error:", error));

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

  // console.log(user);

  return (
    <div>
      <h1>Create a family</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter family name"
          required
          value={familyName}
          onChange={handleInput}
        />
        <button type="submit">Submit</button>
      </form>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg text-center">
            <label
              htmlFor="family-roles"
              className="block mb-2 text-lg font-bold">
              Select Your Family Role:
            </label>
            <select
              id="family-roles"
              value={selectedRole}
              onChange={handleRoleChange}
              className="bg-white border border-gray-300 rounded-md p-2 mb-4">
              <option value="" disabled>
                Select a role
              </option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <div className="flex justify-center">
              <button
                onClick={() => handleModalChoice("Submit")}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2">
                Submit
              </button>
              <button
                onClick={() => handleModalChoice("Cancel")}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-2">
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
