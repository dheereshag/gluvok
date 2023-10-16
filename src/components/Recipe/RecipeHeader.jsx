const RecipeHeader = ({ Icon, text }) => {
  return (
    <span className="flex items-center gap-4 mb-4">
      <Icon className="text-gray-800 text-3xl" />
      <p className="text-gray-800 text-3xl font-semibold">{text}</p>
    </span>
  );
};

export default RecipeHeader;
