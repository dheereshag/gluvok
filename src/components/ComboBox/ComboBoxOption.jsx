import { Combobox } from "@headlessui/react";
import Link from "next/link";

export function ComboBoxOption({ food }) {
  return (
    <Link href={`/${food.id}?type=${food.type}`}>
      <Combobox.Option
        value={food}
        className={({ active }) =>
          `relative py-2 rounded-xl px-3 ${
            active ? "bg-red-600 text-white" : "text-black"
          }`
        }
      >
        {({ active, selected }) => (
          <div>
            <div className="flex items-center gap-2">
              <img
                src={food.image}
                alt=""
                className="w-6 h-6 rounded-full"
                loading="lazy"
              />
              <span className={`truncate ${selected && "font-semibold"}`}>
                {food.title}
              </span>
            </div>

            {selected && (
              <span
                className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                  active ? "text-white" : "text-red-600"
                }`}
              ></span>
            )}
          </div>
        )}
      </Combobox.Option>
    </Link>
  );
}
