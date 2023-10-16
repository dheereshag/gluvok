"use client";
import FoodList from "../Food/FoodList"; // Import the FoodList component
import { useContext } from "react";
import { DataContext } from "../../context/DataContext";
import FoodListHeader from "../Food/FoodListHeader";
const Chineses = () => {
  const { chineseFoods } = useContext(DataContext);
  return (
    <div>
      <FoodListHeader
        foodName="Chinese"
        icon="chinese-food2"
      />
      <FoodList
        foodData={chineseFoods}
        foodName="Chinese"
        icon="chinese-food2"
      />
    </div>
  );
};

export default Chineses;
