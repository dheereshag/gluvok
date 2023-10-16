import FoodCard from "./FoodCard";
import FoodListHeader from "./FoodListHeader";

const FoodList = ({ foodData }) => {
  return (
    <div>
      <FoodListHeader foodName="Favorites" icon={"reddit"} />
      <div className="flex overflow-x-auto max-lg:no-scrollbar py-4">
        {foodData.map((food) => (
          <FoodCard key={food.image} food={food} />
        ))}
      </div>
    </div>
  );
};

export default FoodList;
