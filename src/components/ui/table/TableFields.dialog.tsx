import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Select from "../Select";
import { Checkbox } from "../Checkbox";
import { IComponentConfig } from "@/interfaces/task";

const ExistingFields = ({
  fieldSchema,
  onDeleteField,
}: {
  fieldSchema: IComponentConfig[];
  onDeleteField: (index: number) => void;
}) => (
  <div className="space-y-4">
    {fieldSchema.map((field, index) => (
      <div
        key={index}
        className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
      >
        <div>
          <p className="text-white font-medium">{field.header}</p>
          <p className="text-gray-400 text-sm">Component: {field.component}</p>
          {field.options && (
            <p className="text-gray-400 text-sm">
              Options: {field.options.join(", ")}
            </p>
          )}
        </div>
        {field.isDeletAble && (
          <button
            onClick={() => onDeleteField(index)}
            className="text-red-500 hover:text-red-600"
          >
            Delete
          </button>
        )}
      </div>
    ))}
  </div>
);

const CreateField = ({
  onAddField,
}: {
  onAddField: (newFieldObject: IComponentConfig) => void;
}) => {
  const [newField, setNewField] = useState({
    id: 0,
    name: "",
    type: "Text",
    isDialogOpener: false,
    isSortAble: false,
  });

  const styles = {
    input:
      "w-full text-primary bg-gray-900 rounded-md border-none h-full focus:outline-none p-4 font-semibold",
    label: "text-primary font-semibold text-sm",
  };

  const handleUpdateInput = (field: string, value: string | boolean) => {
    setNewField((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddNewField = () => {
    if (!newField.name.trim()) {
      alert("Field name cannot be empty!");
      return;
    }
    const component =
      newField.type === "Text" || newField.type === "Number"
        ? "Input"
        : "Checkbox";
    const type =
      newField.type === "Text" || newField.type === "Number"
        ? newField.type.toLowerCase()
        : "checkbox";

    const newFieldObject: IComponentConfig = {
      header: newField.name,
      component: component,
      type: type,
      name: newField.name.toLowerCase().replace(/\s+/g, "_"),
      isDialogOpener: newField.isDialogOpener,
      isSortAble: newField.isSortAble,
      isDeletAble: true,
    };

    onAddField(newFieldObject);

    setNewField({
      id: 0,
      name: "",
      type: "Text",
      isDialogOpener: false,
      isSortAble: false,
    });
  };

  return (
    <div className="mt-6 space-y-4">
      <h3 className="font-bold text-lg text-white mb-4">Create New Field</h3>
      <div>
        <label className={styles.label}>Field Name</label>
        <input
          type="text"
          value={newField.name}
          onChange={(e) => handleUpdateInput("name", e.target.value)}
          className={styles.input}
          placeholder="Enter field name"
        />
      </div>
      <div>
        <label className={styles.label}>Field Type</label>
        <div className={`${styles.input} py-0 px-1`}>
          <Select
            value={newField.type}
            onSelect={(value) => handleUpdateInput("type", value)}
            options={["Text", "Number", "Checkbox"]}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <label className={styles.label}>Is Dialog Opener</label>
        <Checkbox
          checked={newField.isDialogOpener}
          onCheckedChange={(value) =>
            handleUpdateInput("isDialogOpener", value)
          }
        />
      </div>
      <div className="flex items-center gap-4">
        <label className={styles.label}>Is Sortable</label>
        <Checkbox
          checked={newField.isSortAble}
          onCheckedChange={(value) => handleUpdateInput("isSortAble", value)}
        />
      </div>
      <button
        onClick={handleAddNewField}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Add Field
      </button>
    </div>
  );
};

const TableFieldsDialog = ({
  children,
  fieldSchema,
  setFieldSchema,
}: {
  children: React.ReactNode;
  fieldSchema: IComponentConfig[];
  setFieldSchema: (schema: IComponentConfig[]) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const handleDeleteField = (index: number) => {
    const updatedSchema = fieldSchema.filter((_, i) => i !== index);
    setFieldSchema(updatedSchema);
  };

  const handleAddField = (newFieldObject: IComponentConfig) => {
    const isFieldExists = fieldSchema.some(
      (field) => field.name === newFieldObject.name
    );

    if (isFieldExists) {
      alert("Field with this name already exists!");
      return;
    }

    setFieldSchema([...fieldSchema, newFieldObject]);
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
                Fields
              </DialogTitle>

              <ExistingFields
                fieldSchema={fieldSchema}
                onDeleteField={handleDeleteField}
              />

              <CreateField onAddField={handleAddField} />

              <div className="mt-4 flex justify-end gap-2 font-semibold">
                <button
                  className="rounded-md px-3 py-2 text-black bg-white"
                  onClick={close}
                >
                  Close
                </button>
                <button
                  className="rounded-md px-3 py-2 bg-secondary text-black"
                  onClick={close}
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

export default TableFieldsDialog;
