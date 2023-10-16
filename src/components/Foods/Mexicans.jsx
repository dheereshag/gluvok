"use client";
import FoodList from "../Food/FoodList"; // Import the FoodList component
import { useContext } from "react";
import { DataContext } from "../../context/DataContext";

const Mexicans = () => {
  const { mexicanFoods } = useContext(DataContext);
  return (
    <FoodList foodData={mexicanFoods} foodName="Mexican" icon="mexican-food3" />
  );
};

export default Mexicans;
