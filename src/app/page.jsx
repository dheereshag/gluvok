import Mexicans from "@/components/Foods/Mexicans";
import Chineses from "@/components/Foods/Chineses";
import Favorites from "@/components/Foods/Favorites";
import OverviewCard from "@/components/Overview/OverviewCard";
export default function Home() {
  return (
    <div>
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
