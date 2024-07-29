import React, { useState } from "react";
import { Input } from "@nextui-org/react";
import { Plus, X } from "lucide-react";

const AddUrls = ({ allResources, setResources }) => {
  const [urlData, setUrlData] = useState({ url: "", title: "" });

  const handleData = (e, index) => {
    const { name, value } = e.target;
    const newResources = [...allResources];
    newResources[index][name] = value;
    setResources(newResources);
  };

  const addResource = () => {
    setResources([
      ...allResources,
      { url: "", title: "" }
    ]);
  };

  const removeResource = (index) => {
    const newResources = allResources.filter((_, i) => i !== index);
    setResources(newResources);
  };

  return (
    <form>
      <div className="space-y-3 w-[80%] ml-10 mt-10">
        {allResources.map((field, index) => (
          <div key={index} className="flex gap-3 items-end">
            <div className="w-[50%] space-y-1">
              {index === 0 && (
                <label className="text-[16px] 2xl:text-[20px]">URL</label>
              )}
              <Input
                type="text"
                variant="bordered"
                placeholder="E.g. www.example.com/security"
                radius="sm"
                size="md"
                name="url"
                onChange={(e) => handleData(e, index)}
                value={field.url}
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
                name="title"
                onChange={(e) => handleData(e, index)}
                value={field.title}
              />
            </div>
            <div className="w-[30px]">
              {index === allResources.length - 1 ? (
                <button
                  type="button"
                  onClick={addResource}
                  className="text-blue-700"
                >
                  <Plus size={35} strokeWidth={5} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => removeResource(index)}
                  className="text-red-500 text-2xl"
                >
                  <X size={35} strokeWidth={5} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </form>
  );
};

AddUrls.displayName = "AddUrls";
export default AddUrls;
