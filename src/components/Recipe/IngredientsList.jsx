const IngredientsList = ({ singleFood, showAllIngredients }) => {
  return (
    <ul className="flex flex-col gap-2 mr-4 text-sm">
      {(showAllIngredients
        ? singleFood.ingredients
        : singleFood.ingredients.slice(0, 5)
      ).map((ingredient, index) => (
        <li
          key={ingredient}
          className="bg-white shadow rounded-xl px-5 py-2 text-gray-800 drop-shadow-sm"
        >
          <div className="flex gap-3">
            <p>{index + 1}.</p>
            <p>{ingredient}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default IngredientsList;
