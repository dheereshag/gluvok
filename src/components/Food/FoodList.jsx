import FoodCard from "./FoodCard";
import FoodListHeader from "./FoodListHeader";
import Loader from "../Loader";

const FoodList = ({ foodData, foodName, icon, loading }) => {
  return (
    <div>
      <FoodListHeader foodName={foodName} icon={icon} />
      <div className="flex overflow-x-auto max-lg:no-scrollbar py-4">
        {foodData.map((food) => (
          <FoodCard key={food.image} food={food} />
        ))}
      </div>
    </div>
  );
};

export default FoodList;
