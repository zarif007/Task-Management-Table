import React, { JSX } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./Sheet";

const SheetForm = ({
  children,
  schema,
}: {
  children: React.ReactNode;
  schema: {
    title: string;
    fields: JSX.Element[];
  };
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader className="my-4">
          <SheetTitle>{schema.title}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 text-gray-400">
          {schema.fields.map((component, index) => (
            <div key={index}>{component}</div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SheetForm;
