import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import useHandleSearchChange from "../../helpers/useHandleSearchChange";
import { Link } from "react-router-dom";
import placeholderImage from "../../assets/recipe_place_holder.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";

const URL = import.meta.env.VITE_BASE_URL;

const Home = ({ setNavBarToggle }) => {
  const [allPublicRecipes, setAllPublicRecipes] = useState([]);
  const [allLunchRecipes, setAllLunchRecipes] = useState([]);
  const [allDinnerRecipes, setAllDinnerRecipes] = useState([]);
  const [homeDefault, setHomeDefault] = useState(true);
  const [searchedRecipes, setSearchedRecipes] = useState([]);

  const { searchInput, handleSearchChange, clearSearch } =
    useHandleSearchChange(allPublicRecipes, setSearchedRecipes, setHomeDefault);

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
    setNavBarToggle(true);
  }, []);

  const sortRecipesAlphabetically = (recipes) => {
    return recipes.sort((a, b) => a.name.localeCompare(b.name));
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="p-6">
      <div className="mb-4 p-4 flex justify-center">
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="Find recipe..."
            value={searchInput}
            onChange={handleSearchChange}
            className="w-full p-2 pl-10 border rounded shadow-md"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          {searchInput && (
            <div
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer">
              <ClearIcon className="text-xs" />
            </div>
          )}
        </div>
      </div>

      {homeDefault && (
        <div className="-mt-9">
          <h1 className="text-3xl font-bold mt-8 mb-2 p-2 rounded section-header">
            Top Lunch Recipes
          </h1>
          <Slider {...sliderSettings} className="mb-6">
            {allLunchRecipes.map((singleLunchRecipe, index) => (
              <Link
                key={singleLunchRecipe.id}
                to={`/recipe_show/${singleLunchRecipe.id}`}>
                <div className="card">
                  <img
                    key={index}
                    src={singleLunchRecipe.photo || placeholderImage}
                    alt={`Recipe ${singleLunchRecipe.name}`}
                    className="object-cover w-full h-48"
                  />
                  <p className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-center py-1">
                    {singleLunchRecipe.name}
                  </p>
                </div>
              </Link>
            ))}
          </Slider>

          <h1 className="text-3xl font-bold mt-8 mb-2 p-2 rounded section-header">
            Top Dinner Recipes
          </h1>
          <Slider {...sliderSettings} className="mb-6">
            {allDinnerRecipes.map((singleDinnerRecipe, index) => (
              <Link
                key={singleDinnerRecipe.id}
                to={`/recipe_show/${singleDinnerRecipe.id}`}>
                <div className="card">
                  <img
                    key={index}
                    src={singleDinnerRecipe.photo || placeholderImage}
                    alt={`Recipe ${singleDinnerRecipe.name}`}
                    className="object-cover w-full h-48"
                  />
                  <p className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-center py-1">
                    {singleDinnerRecipe.name}
                  </p>
                </div>
              </Link>
            ))}
          </Slider>

          <h1 className="text-3xl font-bold mt-8 mb-2 p-2 rounded section-header">
            All Recipes
          </h1>
          <Slider {...sliderSettings}>
            {sortRecipesAlphabetically(allPublicRecipes).map(
              (singleRecipe, index) => (
                <Link
                  key={singleRecipe.id}
                  to={`/recipe_show/${singleRecipe.id}`}>
                  <div className="card">
                    <img
                      key={index}
                      src={singleRecipe.photo || placeholderImage}
                      alt={`Recipe ${singleRecipe.name}`}
                      className="object-cover w-full h-48"
                    />
                    <p className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-center py-1">
                      {singleRecipe.name}
                    </p>
                  </div>
                </Link>
              )
            )}
          </Slider>
        </div>
      )}

      {!homeDefault && (
        <div className="grid grid-cols-3 gap-4">
          {searchedRecipes.length === 0 ? (
            <p className="text-center bg-gray-200 p-4 col-span-3">
              Sorry, recipe cannot be found
            </p>
          ) : (
            searchedRecipes.map((searchedRecipe) => (
              <Link
                key={searchedRecipe.id}
                to={`/recipe_show/${searchedRecipe.id}`}>
                <div className="card">
                  <img
                    src={searchedRecipe.photo || placeholderImage}
                    alt={`Recipe ${searchedRecipe.name}`}
                    className="object-cover w-full h-48"
                  />
                  <p className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-center py-1">
                    {searchedRecipe.name}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
