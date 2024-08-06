import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getUserData } from "../helpers/getUserData";
import { logout } from "../helpers/logout";

import placeholderImage from "../assets/placeholder.png";

function Profile({ signedInWithGoogle }) {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);

  console.log(userDetails);

  const [namesSplit, setNamesSplit] = useState(false);

  useEffect(() => {
    if (signedInWithGoogle && userDetails?.first_name && !namesSplit) {
      setUserDetails((prev) => {
        const firstNameSplit = userDetails.first_name.split(" ");
        return {
          ...prev,
          last_name: firstNameSplit[firstNameSplit.length - 1],
          first_name: firstNameSplit[0],
        };
      });
      setNamesSplit(true); // Set the flag to true to avoid re-running this effect
    }
  }, [signedInWithGoogle, userDetails, namesSplit]);

  async function handleLogout() {
    try {
      await logout();
      // toast.success("User logged out successfully!", {
      //   position: "top-center",
      // });
      navigate("/login");
      // console.log("User logged out successfully!");
    } catch (error) {
      toast.error(error.message, {
        position: "bottom-center",
      });

      console.error("Error logging out:", error.message);
    }
  }

  useEffect(() => {
    async function getUser() {
      const user = await getUserData();
      if (user) setUserDetails(user);
    }
    getUser();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen">
      {userDetails ? (
        <>
          <div className="bg-[#C7DEF1] text-black p-6 rounded-lg shadow-lg mt-10 w-full max-w-4xl">
            <div className="flex items-start">
              <img
                src={userDetails.photo || placeholderImage}
                alt={userDetails.first_name}
                className="rounded-full w-24 h-24 mr-6"
              />
              <div className="flex-1 text-center">
                <h1 className="text-3xl font-bold">
                  {userDetails.first_name}'s Profile Page
                </h1>
                <p className="text-lg mt-2">Email: {userDetails.email}</p>
                <p className="text-lg">Username: {userDetails.first_name}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center w-full mt-10 mb-10">
            <button
              onClick={handleLogout}
              className="bg-red-400 text-white px-6 py-0 w-full max-w-4xl rounded hover:bg-red-500 transition duration-300">
              Logout
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-4">Loading...</h2>
          <button
            onClick={handleLogout}
            className="bg-red-400 text-white px-6 py-0 w-full max-w-4xl rounded hover:bg-red-500 transition duration-300">
            Logout
          </button>
        </>
      )}
    </div>
  );
}

export default Profile;
