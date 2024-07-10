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
      {allPublicRecipes.map((r, index) => {
        return (
          <div key={index}>
            <p>Name:{r.name}</p>
            <p>Chef:{r.chef}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
