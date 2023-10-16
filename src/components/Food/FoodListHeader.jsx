const FoodListHeader = ({ foodName, icon }) => {
  return (
    <span className={`flex items-center gap-2 ml-4 text-gray-800 text-2xl mb-4`}>
      <i className={`ci ci-${icon} ci-2x`}></i>
      <p className="font-bold">{foodName}</p>
    </span>
  );
};

export default FoodListHeader;
