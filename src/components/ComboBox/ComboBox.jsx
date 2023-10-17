"use client";
import { useState, useContext } from "react";
import { Combobox } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { DataContext } from "../../context/DataContext";
import { ComboBoxInput } from "./ComboBoxInput";
import { ComboBoxButton } from "./ComboBoxButton";
import { ComboBoxOption } from "./ComboBoxOption";

export default function ComboBox() {
  const { allFoods } = useContext(DataContext);
  const [query, setQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState();
  const router = useRouter();

  const filteredFood =
    query === ""
      ? allFoods
      : allFoods.filter((food) => {
          return food.title.toLowerCase().includes(query.toLowerCase());
        });

  const truncateTitle = (title) => {
    return title.length > 28 ? title.substring(0, 28) + "..." : title;
  };

  return (
    <Combobox
      as="div"
      value={selectedFood}
      onChange={(value) => {
        setSelectedFood(value);
        if (value) {
          router.push(`/${value.id}?type=${value.type}`);
        }
      }}
      className="w-full relative rounded-xl shadow border"
    >
      <ComboBoxInput
        onChange={(event) => setQuery(event.target.value)}
        displayValue={(food) => truncateTitle(food.title)}
      />

      <ComboBoxButton />

      {filteredFood.length > 0 && (
        <Combobox.Options className="absolute mt-1 max-h-56 w-full rounded-xl py-1 text-sm drop-shadow-2xl overflow-auto z-10 shadow-2xl">
          {filteredFood.map((food) => (
            <ComboBoxOption food={food} key={food.image} />
          ))}
        </Combobox.Options>
      )}
    </Combobox>
  );
}
