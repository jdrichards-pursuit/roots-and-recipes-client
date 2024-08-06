import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getUserData } from "../helpers/getUserData";
import { logout } from "../helpers/logout";

import placeholderImage from "../assets/placeholder.png";

function Profile() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
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
    <div className="flex flex-col items-center min-h-screen py-10">
      {userDetails ? (
        <>
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-2xl flex flex-col items-center">
            <img
              src={userDetails.photo || placeholderImage}
              alt={userDetails.first_name}
              className="rounded-full w-32 h-32 mb-6"
            />
            <h1 className="text-3xl font-bold mb-4">{userDetails.first_name}'s Profile Page</h1>
            <p className="text-lg mb-2">Email: {userDetails.email}</p>
            <p className="text-lg mb-2">Username: {userDetails.first_name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-400 text-white mt-6 px-6 py-3 w-full max-w-2xl rounded-lg hover:bg-red-500 transition duration-300"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-4">Loading...</h2>
          <button
            onClick={handleLogout}
            className="bg-red-400 text-white px-6 py-3 w-full max-w-2xl rounded-lg hover:bg-red-500 transition duration-300"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}

export default Profile;
