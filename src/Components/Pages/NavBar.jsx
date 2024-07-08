import React from "react";
import homeIconPng from "../../assets/home_icon.png";
import familyIconPng from "../../assets/family_icon.png";
import plusIconPng from "../../assets/plus_icon.png";
import cookbookIconPng from "../../assets/cookbook_icon.png";
import profileIconPng from "../../assets/profile_icon.png";

import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div>
      <Link to={`/home`}>
        <span>
          <img src={homeIconPng} alt="home icon" />
        </span>
      </Link>
      <Link to={`/family_cookbook`}>
        <span>
          <img src={familyIconPng} alt="family icon" />
        </span>
      </Link>
      <Link to={`/recipe_form`}>
        <span>
          <img src={plusIconPng} alt="plus icon" />
        </span>
      </Link>
      <Link to={`/cookbook`}>
        <span>
          <img src={cookbookIconPng} alt="cookbook icon" />
        </span>
      </Link>
      <Link to={`/user_profile`}>
        <span>
          <img src={profileIconPng} alt="profile icon" />
        </span>
      </Link>
    </div>
  );
};

export default NavBar;
