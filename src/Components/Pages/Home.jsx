import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";

const URL = import.meta.env.VITE_BASE_URL;

const Home = ({ setBurgerToggle }) => {
  const [allPublicRecipes, setAllPublicRecipes] = useState([]);
  const [allLunchRecipes, setAllLunchRecipes] = useState([]);
  const [allDinnerRecipes, setAllDinnerRecipes] = useState([]);
  const [homeDefault, setHomeDefault] = useState(true);
  const [searchedRecipes, setSearchedRecipes] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const user = getAuth();

  useEffect(() => {
    fetch(`${URL}/api/recipes`)
      .then((res) => res.json())
      .then((data) => {
        setAllPublicRecipes(data);
      })
      .catch((error) => console.error("Error fetching recipe:", error));
    fetch(`${URL}/api/recipes/lunch`)
      .then((res) => res.json())
      .then((data) => {
        setAllLunchRecipes(data);
      })
      .catch((error) => console.error("Error fetching recipe:", error));
    fetch(`${URL}/api/recipes/dinner`)
      .then((res) => res.json())
      .then((data) => {
        setAllDinnerRecipes(data);
      })
      .catch((error) => console.error("Error fetching recipe:", error));
    setBurgerToggle(false);
  }, []);

  const handleSearchChange = (e) => {
    const search = e.target.value;
    setSearchInput(search);
    const result = search.length
      ? allPublicRecipes.filter((recipe) =>
          recipe.name.toLowerCase().includes(search.toLowerCase())
        )
      : [];
    setSearchedRecipes(result);
    setHomeDefault(search.length === 0);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search"
          onChange={handleSearchChange}
          className="w-full p-2 border rounded"
        />
      </div>

      {homeDefault && (
        <>
          <h1 className="text-xl font-bold mb-4">Top Lunch Recipes</h1>
          <div className="flex overflow-x-auto space-x-4">
            {allLunchRecipes.map((r, index) => (
              <div key={index} className="flex-shrink-0">
                <p className="text-center mb-2">{r.name}</p>
                <div className="w-48 h-48 relative">
                  <img
                    key={index}
                    src={r.photo}
                    alt={`Recipe ${r.photo}`}
                    className="object-cover w-full h-full rounded"
                  />
                </div>
              </div>
            ))}
          </div>

          <h1 className="text-xl font-bold mt-8 mb-4">Top Dinner Recipes</h1>
          <div className="flex overflow-x-auto space-x-4">
            {allDinnerRecipes.map((r, index) => (
              <div key={index} className="flex-shrink-0">
                <p className="text-center mb-2">{r.name}</p>
                <div className="w-48 h-48 relative">
                  <img
                    key={index}
                    src={r.photo}
                    alt={`Recipe ${r.photo}`}
                    className="object-cover w-full h-full rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!homeDefault && (
        <>
          {searchedRecipes.length === 0 ? (
            <p className="text-center bg-gray-200 p-4">
              Sorry, recipe cannot be found
            </p>
          ) : (
            searchedRecipes.map((r, index) => (
              <div key={index} className="mb-4">
                <p className="text-center mb-2">{r.name}</p>
                <div className="w-48 h-48 relative mx-auto">
                  <img
                    src={r.photo}
                    alt={`Recipe ${r.name}`}
                    className="object-cover w-full h-full rounded"
                  />
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default Home;
