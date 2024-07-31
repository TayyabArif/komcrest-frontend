import React,{useEffect} from "react";
import { Input } from "@nextui-org/react";
import { Plus, X } from "lucide-react";
import { toast } from "react-toastify";
import useSocket from "@/customHook/useSocket";

const AddUrls = ({ allResources, setAllResources, errors }) => {



  // debugger
  const handleData = (e, index) => {
    const { name, value } = e.target;
    const newResources = [...allResources];
    newResources[index][name] = value;
    setAllResources(newResources);
  };

  const addResource = () => {
    const lastResource = allResources[allResources.length - 1];
    if (!lastResource.url || !lastResource.title) {
      toast.error("Please fill fields before adding a new url.");
      return;
    }
    const newResources = [...allResources, { url: "", title: "" }];
    setAllResources(newResources);
  };
  const removeResource = (index) => {
    const newResources = allResources.filter((_, i) => i !== index);
    setAllResources(newResources);
  };


  return (
    <form>
      <div className="space-y-3 w-[80%] ml-10 mt-10">
        {allResources.map((field, index) => (
          <div key={index} className="flex gap-3 items-end">
            <div className="w-[50%] space-y-1 ">
              {index === 0 && (
                <label className="text-[16px] 2xl:text-[20px]">URL</label>
              )}
              <div className="h-[56px]">
              <Input
                type="text"
                variant="bordered"
                placeholder="E.g. www.example.com/security"
                radius="sm"
                size="md"
                name="url"
                onChange={(e) => handleData(e, index)}
                classNames={{
                  input: `2xl:text-[20px] text-[16px] text-gray-800 ${
                    errors[index]?.url ? "border-red-500" : ""
                  }`,
                }}
                value={field.url}
              />
              {errors[index]?.url && (
                <p className="text-red-500 text-md">{errors[index].url}</p>
              )}
              </div>
            </div>
            <div className="w-[50%] space-y-1 ">
              {index === 0 && (
                <label className="text-[16px] 2xl:text-[20px]">Title</label>
              )}
                <div className=" h-[56px]">
              <Input
                type="text" 
                variant="bordered"
                radius="sm"
                size="md"
                placeholder="E.g. Security"
                name="title"
                onChange={(e) => handleData(e, index)}
                classNames={{
                  input: `2xl:text-[20px] text-[16px] text-gray-800 ${
                    errors[index]?.title ? "border-red-500" : ""
                  }`,
                }}
                value={field.title}
              />
              {errors[index]?.title && (
                <p className="text-red-500 text-md">{errors[index].title}</p>
              )}
               </div>
            </div>
            <div className="w-[30px] h-[55px]">
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

export default AddUrls;
