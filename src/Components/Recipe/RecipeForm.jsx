import { useState, useEffect } from "react";
import { getUserData } from "../../helpers/getUserData";

const RecipeForm = () => {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    async function getUser() {
      // this is a helper function that will check the state of the current user in firebase and fetch the user using the JWT token from localstorage and the uid
      const user = await getUserData();
      // console.log("useEffect Profile:", user);
      if (user) setUserDetails(user);
    }

    getUser();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      {/* {console.log(userDetails)} */}
      {userDetails ? (
        <>
          <img
            src={userDetails.photo || placeholderImage}
            alt={userDetails.first_name}
            style={{
              marginTop: 100,
              marginBottom: 20,
              borderRadius: "50%",
              width: 150,
              height: 150,
            }}
          />

          <h1>{userDetails.first_name}'s Profile Page</h1>

          <p>Email: {userDetails.email}</p>
          <p>First Name: {userDetails.first_name}</p>
          <p>
            Last Name:{" "}
            {userDetails.last_name ? userDetails.last_name : "Unknown"}
          </p>
          <p>Nickname: {userDetails.nickname}</p>

          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <h2>Loading...</h2>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
};

export default RecipeForm;
