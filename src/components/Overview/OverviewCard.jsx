import React from "react";
import CuisineCard from "./CuisineCard";
import StatsCard from "./StatsCard";

const OverviewCard = () => {
  return (
    <article className="shadow-lg border rounded-xl mx-4 px-5 pt-5 pb-7">
      <aside className="grid grid-cols-2 gap-6">
        <CuisineCard
          icon="ci ci-mexican-food3 ci-2x"
          title="Mexican"
          description="Mexican food is known for its bold and spicy flavors, often featuring ingredients like tortillas, chile peppers, tomatoes, and beans."
        />
        <StatsCard time="2 hours" difficulty="Easy" />
      </aside>

      <aside className="grid grid-cols-2 gap-6 mt-6">
        <CuisineCard
          icon="ci ci-chinese-food2 ci-2x"
          title="Chinese"
          description="Chinese food on the other hand is characterized by its diverse range of flavors and ingredients, with a heavy emphasis on rice, noodles, and soybeans."
        />
        <StatsCard time="3 hours" difficulty="Medium" />
      </aside>
    </article>
  );
};

export default OverviewCard;
