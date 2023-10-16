import { useContext } from "react";
import { DataContext } from "../context/DataContext";

export const useFavorites = (food) => {
  const { favorites, setFavorites, favoritesLoading } =
    useContext(DataContext);

  const liked = Boolean(favorites[food.image]);

  const toggleLiked = () => {
    let newFavorites = { ...favorites };
    if (newFavorites[food.image]) {
      delete newFavorites[food.image];
    } else {
      newFavorites[food.image] = food;
    }
    setFavorites(newFavorites);
  };

  return { liked, toggleLiked, favoritesLoading };
};
