import Link from "next/link";
import { FaHeart } from "react-icons/fa6";
import { GiFoodTruck } from "react-icons/gi";
import ComboBox from "./ComboBox/ComboBox";
const Navbar = () => {
  return (
    <nav>
      <div className="flex justify-between items-center gap-3 px-4 py-5">
        <Link href="/">
          <GiFoodTruck className="h-8 w-8" />
        </Link>
        <div className="flex items-center gap-3 w-full md:w-6/12 lg:w-4/12">
          <ComboBox />
          <Link
            href="/#favorites"
            className="text-red-500 hover:scale-110 transform-gpu transition-all"
          >
            <span className="sr-only">Favorites</span>
            <FaHeart className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
