const RecipeHeader = ({ Icon, text }) => {
  return (
    <span className="flex items-center gap-4 mb-4">
      <Icon className="text-gray-800 text-2xl" />
      <p className="text-gray-800 text-2xl font-pacifico">{text}</p>
    </span>
  );
};

export default RecipeHeader;
