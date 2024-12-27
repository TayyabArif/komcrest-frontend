import React from "react";
import { PRICING_DATA } from "@/constants";
import { Button } from "@nextui-org/react";
import { CircleCheckBig } from "lucide-react";

const ChangeSubscription = () => {
  return (
    <>
      <container className="flex  flex-wrap w-full gap-4 items-center px-10">
        {PRICING_DATA.map((data, index) => (
            <div
            key={index}
              style={{ backgroundColor: data.cardColor }}
              className="w-[30%] p-4 bg-white group  rounded-md lg:hover:-translate-y-3 ease-in duration-300 hover:bg-[#0B0641] hover:text-white border xl:border-none border-[#0B0641]"
            >
              <div className="flex flex-row gap-5 items-center">
                <span className="text-2xl font-bold">{data.name}</span>
              </div>
              <div className="my-0">
                {data.benefits.map((data, index) => (
                  <div
                    key={index}
                    className="flex flex-row gap-3  items-start mt-3  text-left text-[16px] 2xl:text-[20px]"
                  >
                    <div className="pt-1 shrink-0">
                      <CircleCheckBig size={20} />
                    </div>
                    <span>{data}</span>
                  </div>
                ))}
              </div>
              <div className="border border-dashed border-[#A9A9AA] tracking-widest my-4" />

              <div className="bottom-6 left-6 right-6 ">
                <div className="flex justify-between items-center">
                  <span className="text-[32px] font-bold ">{data.price}</span>
                  <Button
                    size="md"
                    color="primary"
                    className="rounded-md 2xl:text-[20px]  text-[16px]"
                    
                  >
                     {index == 1 ? "Activated" : "Upgrade" }
                  </Button>
                </div>
              </div>
            </div>
        
        ))}
      </container>
    </>
  );
};

export default ChangeSubscription;
