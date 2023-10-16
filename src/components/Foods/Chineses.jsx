"use client";
import FoodList from "../Food/FoodList"; // Import the FoodList component
import { useContext } from "react";
import { DataContext } from "../../context/DataContext";
const Chineses = () => {
  const { chineseFoods } = useContext(DataContext);
  return (
    <FoodList
      foodData={chineseFoods}
      foodName="Chinese"
      icon="chinese-food2"
    />
  );
};

export default Chineses;
