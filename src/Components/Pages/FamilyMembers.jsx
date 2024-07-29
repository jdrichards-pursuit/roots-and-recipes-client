import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../helpers/getUserData";
import { data } from "autoprefixer";

const URL = import.meta.env.VITE_BASE_URL;

export const FamilyMembers = () => {
  const [user, setUser] = useState({});
  const [familyMembers, setFamilyMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalChoice, setModalChoice] = useState("");
  const [selectedMember, setSelectedMember] = useState([]);
  //Fetch for all family members
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      try {
        const user = await getUserData();
        if (user) {
          setUser(user);
          const response = await fetch(
            `${URL}/api/families/users/${user.family_code}`
          );
          const data = await response.json();
          setFamilyMembers(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const handleModalChoice = async (choice) => {
    setModalChoice(choice);
    try {
      if (choice === "yes") {
        //assign owner and leave family fetch
        fetch(`${URL}/api/families/owner/${user.id}/${selectedMember.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => {
          // Check if response is OK
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          // Return JSON response
          return res.json();
        });
        //   .catch((error) => console.error("Fetch error:", error));

        navigate(`/home`);
      } else {
        navigate(`/family_members`);
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
    }
    setShowModal(false); // Close modal after choice
  };
  //display members
  //onClick Modal that confirms this member
  //if yes trigger the fetch function
  //this fetch will update the selected members user table owner key to true and change the users table owner key to false
  //another fetch will change the family_code key to '000000'
  //navigate user to home page || family cookbook

  const handleClick = (member) => {
    setShowModal(true);
    setSelectedMember(member);
  };
  return (
    <div>
      {familyMembers.length > 0 &&
        familyMembers
          .filter((member) => member.id != user.id)
          .map((member, index) => {
            return (
              <div key={index} onClick={() => handleClick(member)}>
                {member.first_name}
              </div>
            );
          })}

      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg text-center">
            <p className="mb-3">Are you sure?</p>
            <div className="flex justify-center">
              <button
                onClick={() => handleModalChoice("yes")}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2">
                yes
              </button>
              <button
                onClick={() => handleModalChoice("no")}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-2">
                no
              </button>
            </div>
          </div>
        </div>
      )}

      <button onClick={() => navigate("/family_cookbook")}>Back</button>
    </div>
  );
};
