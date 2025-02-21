"use client";

import React from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import clsx from "clsx";

export default function Select({
  value,
  options,
  onSelect,
}: {
  value: string;
  options: string[];
  onSelect?: (value: string) => void;
}) {
  return (
    <div className={clsx("w-full relative p-2.5 text-white")}>
      <Listbox value={value} onChange={onSelect}>
        <div className="relative">
          <ListboxButton
            className={clsx(
              "appearance-none w-full border-none text-sm/6 ",
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
            )}
          >
            <div className="w-fit bg-secondary text-black px-3 py-1 rounded-lg">
              {value}
            </div>
          </ListboxButton>
          <ListboxOptions className="absolute m-1 min-w-[80px] max-w-[400px] bg-black border border-secondary rounded-lg shadow-lg max-h-60 overflow-auto z-50">
            {options.map((option, index) => (
              <ListboxOption
                key={index}
                value={option}
                className={() =>
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
