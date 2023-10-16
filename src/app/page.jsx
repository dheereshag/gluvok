import Mexicans from "@/components/Foods/Mexicans";
import Chineses from "@/components/Foods/Chineses";
import Favorites from "@/components/Foods/Favorites";
import OverviewCard from "@/components/Overview/OverviewCard";
export default function Home() {
  return (
    <div>
      {/* <section className="ml-4 mt-4">
        <h1 className="text-3xl sm:text-3xl text-gray-800 font-pacifico">
          mex-chi
        </h1>
      </section> */}
      <section className="mt-6 mb-10">
        <OverviewCard />
      </section>
      <section className="my-2">
        <Mexicans />
      </section>
      <section className="mt-8 mb-2">
        <Chineses />
      </section>
      <section className="mt-8 mb-14" id="favorites">
        <Favorites />
      </section>
    </div>
  );
}
