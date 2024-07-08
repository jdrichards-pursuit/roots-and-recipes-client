import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import hamburgerMenuIconPng from "../../assets/ham_menu_icon.png";

const BurgerMenu = () => {
  const [hamMenuToggle, setHamMenuToggle] = useState(false);

  useEffect(() => {
    console.log(hamMenuToggle);
  }, [hamMenuToggle]);
  return (
    <div>
      <span>
        <img
          src={hamburgerMenuIconPng}
          alt="hamburger menu icon"
          onClick={() => {
            setHamMenuToggle(!hamMenuToggle);
          }}
        />
      </span>

      {hamMenuToggle && (
        <div>
          <Link to={`/about_us`}>
            <h2>About Us</h2>
          </Link>
          <Link to={`/faq`}>
            <h2>FAQ</h2>
          </Link>
          <Link to={`/contact_us`}>
            <h2>Contact Us</h2>
          </Link>
        </div>
      )}
    </div>
  );
};

export default BurgerMenu;
