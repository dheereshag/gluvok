import { ImStatsBars2 } from "react-icons/im";
import DifficultyBadge from "../Food/DifficultyBadge";

const StatsCard = ({ time, difficulty }) => {
  return (
    <div>
      <span className="flex items-baseline gap-2 text-gray-800 text-lg sm:text-2xl mb-2">
        <ImStatsBars2 />
        <h2 className="font-bold">Statistics</h2>
      </span>
      <span className="text-xs md:text-sm flex justify-between items-center font-dm-sans">
        <p>Avg. time</p>
        <p className="font-semibold text-sm">{time}</p>
      </span>
      <span className="text-xs md:text-sm flex justify-between mt-1 items-center font-dm-sans">
        <p>Difficulty</p>
        <DifficultyBadge difficulty={difficulty} />
      </span>
    </div>
  );
};

export default StatsCard;
