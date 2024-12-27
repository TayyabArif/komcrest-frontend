import React,{useEffect} from "react";
import { Input } from "@nextui-org/react";
import { Plus, X } from "lucide-react";
import { toast } from "react-toastify";
import useSocket from "@/customHook/useSocket";
import { urlPattern } from "../../../../helper/index";
import {Button} from "@nextui-org/react";

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
    }else if (!urlPattern.test(lastResource.url)) {
      toast.error("Invalid Url")
    }else {
      const newResources = [...allResources, { url: "", title: "" ,status:"Pending" }];
      setAllResources(newResources);

    }
  
  };
  const removeResource = (index) => {
    const newResources = allResources.filter((_, i) => i !== index);
    setAllResources(newResources);
  };


  return (
    
      <div className="space-y-3 w-[100%] mt-10 flex flex-col  overflow-auto">
        {allResources.map((field, index) => (
          <div key={index} className="flex gap-3 items-end">
            <div className="w-[45%] space-y-1 ">
              {index === 0 && (
                <label className="text-[16px] 2xl:text-[20px]">URL</label>
              )}
              <div className="h-[56px]">
              <Input
                type="text"
                variant="bordered"
                placeholder="E.g. www.example.com/security"
                isDisabled={index !== allResources.length - 1 } 
                radius="sm"
                size="md"
                name="url"
                onChange={(e) => handleData(e, index)}
                classNames={{
                  input: "2xl:text-[20px] text-[16px] text-gray-800 ",
                }}
                value={field.url}
              />
              </div>
            </div>
            <div className="w-[45%] space-y-1 ">
              {index === 0 && (
                <label className="text-[16px] 2xl:text-[20px]">Title</label>
              )}
                <div className=" h-[56px]">
              <Input
                type="text" 
                variant="bordered"
                radius="sm"
                size="md"
                isDisabled={index !== allResources.length - 1 } 
                placeholder="E.g. Security"
                name="title"
                onChange={(e) => handleData(e, index)}
                classNames={{
                  input: "2xl:text-[20px] text-[16px] text-gray-800 ",
                }}
                value={field.title}
              />
              
               </div>
            </div>
            <div className="w-[30px] h-[55px]">
              {index === allResources.length - 1 ? (
                 <Button
                 onClick={addResource}
                 radius="none"
                 size="md"
                 className="text-white px-3  text-[16px] 2xl:text-[20px] cursor-pointer font-semibold bg-btn-primary w-max rounded-[4px]"
               >
                 Add
               </Button>
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
  );
};

export default AddUrls;
