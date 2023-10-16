"use client";
import React, { useState, useContext } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { LuUtensilsCrossed } from "react-icons/lu";
import { GiCook } from "react-icons/gi";
import SingleFoodOverviewCard from "@/components/SingleFood/SingleFoodOverviewCard";
import IngredientsList from "@/components/Recipe/IngredientsList";
import InstructionsList from "@/components/Recipe/InstructionsList";
import RecipeHeader from "@/components/Recipe/RecipeHeader";
import ShowButton from "@/components/Recipe/ShowButton";
import { DataContext } from "@/context/DataContext";

const SingleFood = () => {
  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const [showAllInstructions, setShowAllInstructions] = useState(false);
  const { allFoods } = useContext(DataContext);

  const { id } = useParams();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const singleFood = allFoods.find(
    (food) => food.id === id && food.type === type
  );

  return (
    <div className="mt-4">
      <h1 className="mx-4 text-gray-800 text-3xl mb-4 font-pacifico">
        {singleFood.title}
      </h1>
      <img
        src={singleFood.image}
        alt={singleFood.title}
        className="w-full h-72 object-cover"
      />
      <section className="relative mx-4 h-64">
        <SingleFoodOverviewCard singleFood={singleFood} />
      </section>

      <section className="mt-4 mx-4">
        <RecipeHeader Icon={LuUtensilsCrossed} text="Ingredients" />
        <IngredientsList
          singleFood={singleFood}
          showAllIngredients={showAllIngredients}
        />
        <ShowButton
          showAll={showAllIngredients}
          setShowAll={setShowAllIngredients}
        />
      </section>
      <section className="mt-10 mx-4 mb-20">
        <RecipeHeader Icon={GiCook} text="Instructions" />
        <InstructionsList
          singleFood={singleFood}
          showAllInstructions={showAllInstructions}
        />
        <ShowButton
          showAll={showAllInstructions}
          setShowAll={setShowAllInstructions}
        />
      </section>
    </div>
  );
};

export default SingleFood;
