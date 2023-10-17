import Link from "next/link";
import DifficultyBadge from "./DifficultyBadge";
import { FaRegHeart, FaShareFromSquare, FaHeart } from "react-icons/fa6";
import { useFavorites } from "../../hooks/useFavorites";
import shareContent from "@/utils/shareContent";

const FoodCard = ({ food }) => {
  const { liked, toggleLiked } = useFavorites(food);

  const handleShare = () => {
    shareContent({
      title: food.title,
      text: `Check out this food: ${food.title}`,
      url: window.location.origin + "/" + food.id + "?type=" + food.type,
    });
  };

  return (
    <div className="h-72 shadow rounded-2xl transform-gpu transition-all hover:shadow-md hover:scale-105 last:mr-4">
      <Link href={`/${food.id}?type=${food.type}`}>
        <img
          src={food.image}
          className="w-48 h-48 object-cover rounded-t-2xl"
          loading="lazy"
        />
        <p className="text-xs font-semibold px-2 mt-4 truncate w-48">
          {food.title}
        </p>
      </Link>
      <div className="flex mx-3 justify-between items-center mt-5">
        <div className="flex gap-5 items-center">
          {liked ? (
            <FaHeart
              onClick={toggleLiked}
              className="text-red-500 h-6 w-6 cursor-pointer hover:scale-110 transition-all transform-gpu"
            />
          ) : (
            <FaRegHeart
              onClick={toggleLiked}
              className="text-red-500 h-6 w-6 cursor-pointer hover:scale-110 transition-all transform-gpu"
            />
          )}
          <FaShareFromSquare
            onClick={handleShare}
            className="text-gray-500 h-5 w-5 cursor-pointer hover:scale-110 transition-all transform-gpu"
          />
        </div>
        <DifficultyBadge difficulty={food.difficulty} />
      </div>
    </div>
  );
};

export default FoodCard;
