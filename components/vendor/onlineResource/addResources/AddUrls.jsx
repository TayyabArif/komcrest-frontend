import React, { forwardRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@nextui-org/react";
import { Plus, X } from "lucide-react";

const AddUrls = forwardRef(({ onSubmit, formData }, ref) => {
  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: formData,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
  });

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset(data);
  };

  return (
    <form ref={ref} onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="space-y-3 w-[80%] ml-10 mt-10">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-3 items-end">
            <div className="w-[50%] space-y-1">
              {index === 0 && (
                <label className="text-[16px] 2xl:text-[20px]">URL</label>
              )}
              <Input
                type="text"
                variant="bordered"
                placeholder="E.g. www.komcret.com/security"
                radius="sm"
                size="md"
                {...register(`links.${index}.url`)}
                defaultValue={field.url}
              />
            </div>
            <div className="w-[50%] space-y-1">
              {index === 0 && (
                <label className="text-[16px] 2xl:text-[20px]">Title</label>
              )}
              <Input
                type="text"
                variant="bordered"
                radius="sm"
                size="md"
                placeholder="E.g. Security"
                {...register(`links.${index}.title`)}
                defaultValue={field.title}
              />
            </div>
            <div className="w-[30px]">
              {index === fields.length - 1 ? (
                <button
                  type="button"
                  onClick={() => append({ url: "", title: "" })}
                  className="text-blue-700"
                >
                  <Plus size={35} strokeWidth={5} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 text-2xl"
                >
                  <X size={35} strokeWidth={5} />
                </button>
              )}
            </div>
          </div>
        ))}
        <button type="submit" className="hidden">Submit</button>
      </div>
    </form>
  );
});

export default AddUrls;
