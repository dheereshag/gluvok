import SingleFoodInfo from "./SingleFoodInfo";

const SingleFoodCard = ({ singleFood }) => {
  return (
    <div className="shadow-lg rounded-xl border border-gray-300 border-opacity-50 px-4 py-6 bg-white absolute -top-10 w-full">
      <span className="flex items-center gap-2 text-gray-800 text-2xl sm:text-3xl mb-4">
        <img
          src={singleFood.image}
          alt={singleFood.title}
          className="w-8 h-8 rounded-full object-cover"
        />
        <p className="font-bold">Overview</p>
      </span>
      <article className="text-gray-800 mt-2 text-sm">
        {singleFood.description}
      </article>
      <SingleFoodInfo singleFood={singleFood} />
    </div>
  );
};

export default SingleFoodCard;
