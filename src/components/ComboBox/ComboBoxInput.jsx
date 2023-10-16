import { Combobox } from "@headlessui/react";

export function ComboBoxInput({ onChange, displayValue }) {
  return (
    <Combobox.Input
      className="w-full rounded-xl py-2 px-4 border-none focus:ring-1 focus:ring-red-500 text-sm"
      onChange={onChange}
      displayValue={displayValue}
      placeholder="Search recipes..."
    />
  );
}
