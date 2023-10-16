const FoodListHeader = ({ foodName, icon }) => {
  return (
    <span className={`flex items-center gap-2 ml-4 text-gray-800 text-2xl mb-4`}>
      <i className={`ci ci-${icon} ci-2x`}></i>
      <h1 className="font-pacifico">{foodName}</h1>
    </span>
  );
};

export default FoodListHeader;
