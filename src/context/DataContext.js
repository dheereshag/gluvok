"use client";
import { createContext, useState, useEffect } from "react";
import chineseFoodsFromFile from "../constants/chineseFoods";
import mexicanFoodsFromFile from "../constants/mexicanFoods";
// Create a context
export const DataContext = createContext();
// Create a provider which will hold our global state
export const DataProvider = ({ children }) => {
  const [favorites, setFavorites] = useState({});
  const [favoritesLoading, setFavoritesLoading] = useState(true);

  const chineseFoods = chineseFoodsFromFile.map((food) => ({
    ...food,
    type: "chinese",
  }));

  const mexicanFoods = mexicanFoodsFromFile.map((food) => ({
    ...food,
    type: "mexican",
  }));

  const allFoods = [...chineseFoods, ...mexicanFoods];

  // Load favorites from local storage when component mounts
  useEffect(() => {
    const loadedFavorites = JSON.parse(localStorage.getItem("favorites")) || {};
    setFavorites(loadedFavorites);
    setFavoritesLoading(false);
  }, []);

  // Save favorites to local storage when they change
  useEffect(() => {
    if (favoritesLoading) return;
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <DataContext.Provider
      value={{
        favorites,
        setFavorites,
        favoritesLoading,
        chineseFoods,
        mexicanFoods,
        allFoods,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
