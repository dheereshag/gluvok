import SingleFoodInfo from "./SingleFoodInfo";

const SingleFoodOverviewCard = ({ singleFood }) => {
  return (
    <div className="shadow-lg rounded-xl border border-gray-300 border-opacity-50 px-4 py-6 bg-white absolute -top-10">
      <span className="flex items-center gap-2 text-gray-800 text-2xl mb-4">
        <img
          src={singleFood.image}
          alt={singleFood.title}
          className="w-8 h-8 rounded-full object-cover"
        />
        <h2 className="font-pacifico">Overview</h2>
      </span>
      <article className="text-gray-800 mt-2 text-sm h-24 overflow-auto">
        {singleFood.description}
      </article>
      <SingleFoodInfo singleFood={singleFood} />
    </div>
  );
};

export default SingleFoodOverviewCard;
