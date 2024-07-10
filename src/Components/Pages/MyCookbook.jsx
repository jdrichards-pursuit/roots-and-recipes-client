import React from "react";
import { getAuth } from "firebase/auth";

export const MyCookbook = () => {
  // need to use useAuth for the user
  // create a state called "usersUID" and then set the initial value to user.currentUser.uid
  // make a fetch call to "/user/:uid" and give the state as the uid value (template literals)
  // store this data into a user state

  // we need this to have access to the users information that is protected by firebase
  const user = getAuth();

  return (
    <div className="text-center">
      <div>MyCookbook</div>
    </div>
  );
};
