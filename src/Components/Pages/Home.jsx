import { useState, useEffect } from "react";

import { getAuth } from "firebase/auth";

const URL = import.meta.env.VITE_BASE_URL;

const Home = ({ setBurgerToggle }) => {
  const [allPublicRecipes, setAllPublicRecipes] = useState([]);
  const [allLunchRecipes, setAllLunchRecipes] = useState([]);
  const [allDinnerRecipes, setAllDinnerRecipes] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [homeDefault, setHomeDefault] = useState(true);
  const [searchedRecipes, setSearchedRecipes] = useState([]);

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
    // setSearchInput(...(e.target.value + e.target.value));
    setSearchInput(e.target.value);
  };
  const handleSearchInput = (e) => {
    e.preventDefault();

    setSearchedRecipes(
      allPublicRecipes.filter(
        (r) => r.name.toLowerCase() === searchInput.toLowerCase()
      )
    );
    console.log(allPublicRecipes.filter((r) => r.name.includes(" ")));
    setHomeDefault(false);
  };
  // console.log(searchInput);

  return (
    <div>
      <form onSubmit={handleSearchInput}>
        <input type="text" placeholder="Search" onChange={handleSearchChange} />
      </form>

      {homeDefault && (
        <>
          <h1>Top Lunch Recipes</h1>
          <div style={{ display: "flex", overflowX: "auto", maxWidth: "100%" }}>
            {allLunchRecipes.map((r, index) => {
              return (
                <div key={index}>
                  <p>{r.name}</p>
                  <img
                    key={index}
                    src={r.photo}
                    alt={`Recipe ${r.photo}`}
                    style={{
                      flex: "0 0 auto",
                      marginRight: "10px",
                      height: "200px",
                      width: "auto",
                      border: "1px solid black",
                    }}
                  />
                </div>
              );
            })}
          </div>

          <h1>Top Dinner Recipes</h1>
          <div style={{ display: "flex", overflowX: "auto", maxWidth: "100%" }}>
            {allDinnerRecipes.map((r, index) => {
              return (
                <div key={index}>
                  <p>{r.name}</p>
                  <img
                    key={index}
                    src={r.photo}
                    alt={`Recipe ${r.photo}`}
                    style={{
                      flex: "0 0 auto",
                      marginRight: "10px",
                      height: "200px",
                      width: "auto",
                      border: "1px solid black",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}

      {searchedRecipes.map((r, index) => (
        <div key={index}>
          <p>{r.name}</p>
          <img
            src={r.photo}
            alt={`Recipe ${r.name}`}
            style={{
              flex: "0 0 auto",
              marginRight: "10px",
              height: "200px",
              width: "auto",
              border: "1px solid black",
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default Home;
