import { useEffect } from "react";

const FamilyCookbook = ({ setBurgerToggle }) => {
  useEffect(() => {
    setBurgerToggle(false);
  }, []);

  return <div>FamilyCookbook</div>;
};

export default FamilyCookbook;
