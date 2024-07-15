import React, { useEffect } from "react";

export const MyCookbook = ({ setBurgerToggle }) => {
  useEffect(() => {
    setBurgerToggle(false);
  }, []);

  return <div>MyCookbook</div>;
};
