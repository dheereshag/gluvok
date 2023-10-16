import { Combobox } from "@headlessui/react";
import { FaBowlFood } from "react-icons/fa6";

export function ComboBoxButton() {
  return (
    <Combobox.Button className="absolute inset-y-0 right-0 px-3">
      <FaBowlFood className="h-5 w-5 text-gray-400" aria-hidden="true" />
    </Combobox.Button>
  );
}
