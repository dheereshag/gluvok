"use client";
import FoodList from "../Food/FoodList"; // Import the FoodList component
import { useContext } from "react";
import { DataContext } from "../../context/DataContext";
import FoodListHeader from "../Food/FoodListHeader";
import Loader from "../Food/Loader";

const Favorites = () => {
  const { favorites, favoritesLoading } = useContext(DataContext);

  return (
    <div>
      <FoodListHeader foodName="Favorites" icon={"reddit"} />
      {favoritesLoading && <Loader />}
      <FoodList
        foodData={Object.values(favorites)}
        foodName="Favorites"
        icon={"reddit"}
      />
    </div>
  );
};

export default Favorites;
