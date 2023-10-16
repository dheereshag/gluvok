"use client";
import FoodList from "../Food/FoodList"; // Import the FoodList component
import { useContext } from "react";
import { DataContext } from "../../context/DataContext";

const Favorites = () => {
  const { favorites } = useContext(DataContext);

  return (
    <FoodList
      foodData={Object.values(favorites)}
      foodName="Favorites"
      icon={"reddit"}
    />
  );
};

export default Favorites;
