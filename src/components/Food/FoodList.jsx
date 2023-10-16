import FoodCard from "./FoodCard";

const FoodList = ({ foodData }) => {
  return (
    <div className="flex overflow-x-auto max-lg:no-scrollbar py-4">
      {foodData.map((food) => (
        <FoodCard key={food.image} food={food} />
      ))}
    </div>
  );
};

export default FoodList;
