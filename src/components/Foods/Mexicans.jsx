"use client";
import FoodList from "../Food/FoodList"; // Import the FoodList component
import { useContext } from "react";
import { DataContext } from "../../context/DataContext";
import FoodListHeader from "../Food/FoodListHeader";

const Mexicans = () => {
  const { mexicanFoods } = useContext(DataContext);
  return (
    <div>
      <FoodListHeader foodName="Mexican" icon="mexican-food3" />
      <FoodList
        foodData={mexicanFoods}
        foodName="Mexican"
        icon="mexican-food3"
      />
    </div>
  );
};

export default Mexicans;
