import { useState, useEffect } from "react";

import { getAuth } from "firebase/auth";

const URL = import.meta.env.VITE_BASE_URL;

const Home = () => {
  const [allPublicRecipes, setAllPublicRecipes] = useState([]);

  const user = getAuth();

  useEffect(() => {
    fetch(`${URL}/api/recipes`)
      .then((res) => res.json())
      .then((data) => {
        setAllPublicRecipes(data);
        console.log(user);
      })
      .catch((error) => console.error("Error fetching recipe:", error));
  }, []);
  return (
    <div>
      {allPublicRecipes.map((r) => {
        <img src={r.photo} alt={`${r.photo}`} />;
      })}
    </div>
  );
};

export default Home;
