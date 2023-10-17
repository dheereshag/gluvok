import { GiClockwork, GiBowlOfRice, GiMountainClimbing } from "react-icons/gi";
import extractTime from "../../utils/extractTime";
import DifficultyBadge from "../Food/DifficultyBadge";

const SingleFoodInfo = ({ singleFood }) => {
  return (
    <div className="mt-4 grid grid-cols-4 gap-4">
      <div className="flex flex-col items-center gap-2">
        <GiClockwork className="text-gray-800 text-4xl" />
        <p className="text-gray-800 text-xs text-center">Avg. Time</p>
        <p className="text-gray-800 text-sm font-semibold">
          {extractTime(singleFood.time)} mins
        </p>
      </div>
      <div className="flex flex-col items-center gap-2 col-span-2">
        <GiBowlOfRice className="text-gray-800 text-4xl" />
        <p className="text-gray-800 text-xs">Portion</p>
        <p className="text-gray-800 text-sm font-semibold text-center">
          {singleFood.portion}
        </p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <GiMountainClimbing className="text-gray-800 text-4xl" />
        <p className="text-gray-800 text-xs">Difficulty</p>
        <DifficultyBadge difficulty={singleFood.difficulty} />
      </div>
    </div>
  );
};

export default SingleFoodInfo;
