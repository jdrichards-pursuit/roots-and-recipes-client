import React from "react";

import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div>
      <Link to={`/recipe_form`}>
        <p>Plus icon Image</p>
      </Link>

      <div>NavBar</div>
    </div>
  );
};

export default NavBar;
