import SingleFoodInfo from "./SingleFoodInfo";

const SingleFoodOverviewCard = ({ singleFood }) => {
  return (
    <div className="shadow-lg rounded-xl border border-gray-300 border-opacity-50 px-4 py-6 bg-white absolute -top-10">
      <h2 className="font-pacifico text-gray-800 text-2xl mb-4">Overview</h2>
      <article className="text-gray-800 mt-2 text-sm h-24 overflow-auto">
        {singleFood.description}
      </article>
      <SingleFoodInfo singleFood={singleFood} />
    </div>
  );
};

export default SingleFoodOverviewCard;
