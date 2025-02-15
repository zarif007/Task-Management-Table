"use client";

import { ITableHeaders, ITask } from "@/interfaces/table";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import React, { JSX, useState } from "react";
import Select from "./Select";
import { taskPriority, taskStatus } from "@/constants/table";

const DialogForm = ({
  children,
  schema,
}: {
  children: React.ReactNode;
  schema: {
    title: string;
    handleOnSave: () => void;
    components: JSX.Element[];
  };
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const handleOnSave = () => {
    close();
    schema.handleOnSave();
  };

  return (
    <>
      <div onClick={open}>{children}</div>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={close}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-xl rounded-lg bg-black border border-secondary p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle
                as="h3"
                className="my-3 font-bold text-lg text-white"
              >
                {schema.title}
              </DialogTitle>
              <div className="flex flex-col gap-2 text-gray-400">
                {schema.components.map((component, index) => (
                  <div key={index}>{component}</div>
                ))}
              </div>
              <div className="mt-4 flex justify-end gap-2 font-semibold">
                <button
                  className="rounded-md px-3 py-2 text-black bg-white"
                  onClick={close}
                >
                  Close
                </button>
                <button
                  className="rounded-md px-3 py-2 bg-secondary text-black"
                  onClick={handleOnSave}
                >
                  Save
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default DialogForm;
