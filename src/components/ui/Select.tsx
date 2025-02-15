"use client";

import React, { useState } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import clsx from "clsx";

export default function Select({
  defaultValue,
  options,
  onSelect,
}: {
  defaultValue: string;
  options: string[];
  onSelect?: (value: string) => void;
}) {
  const [selected, setSelected] = useState(defaultValue);

  const handleChange = (value: string) => {
    setSelected(value);
    onSelect?.(value);
  };

  return (
    <div className={clsx("w-full relative p-2.5 text-white")}>
      <Listbox value={selected} onChange={handleChange}>
        <div className="relative">
          <ListboxButton
            className={clsx(
              "appearance-none w-full border-none text-sm/6 ",
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
            )}
          >
            <div className="w-fit bg-secondary text-black px-2 py-1 rounded-lg">
              {selected}
            </div>
          </ListboxButton>
          <ListboxOptions className="absolute mt-1 w-full bg-black border border-secondary rounded-lg shadow-lg max-h-60 overflow-auto z-50">
            {options.map((option, index) => (
              <ListboxOption
                key={index}
                value={option}
                className={({ active }) =>
                  clsx(
                    "cursor-pointer select-none px-2 py-1 hover:bg-secondary hover:text-black"
                  )
                }
              >
                {option}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}
