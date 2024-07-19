import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@nextui-org/react";
import { Plus ,X } from 'lucide-react';
const AddUrls = () => {
  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      links: [{ url: "", title: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
  });

  const onSubmit = (data) => {
    console.log("Submitted Data: ", data);
    // Process the data as needed
    reset();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-3 w-[80%] ml-10 mt-10">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-3">
            <Input
              type="text"
              variant="bordered"
              placeholder="E.g. www.komcret.com/security"
              radius="sm"
              {...register(`links.${index}.url`)}
              defaultValue={field.url}
              className="w-[50%]"
            />
            <Input
              type="text"
              variant="bordered"
              radius="sm"
              placeholder="E.g. Security"
              {...register(`links.${index}.title`)}
              defaultValue={field.url}
              className="w-[50%]"
            />
            <div className=" w-[30px] flex items-center">
            { index == fields.length - 1 ? (
              <button
              type="button"
              onClick={() => append({ url: "", title: "" })}
              className="text-blue-700 "
            >
              <Plus  size={35} strokeWidth={5}/>
            </button>
             
            ) : (
              <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-500 text-2xl"
            >
              <X  size={35} strokeWidth={5}/>
            </button>
            )}
            </div>
          </div>
        ))}
      </div>

      {/* <button type="submit">Submit</button> */}
    </form>

    
  );
};

export default AddUrls;
