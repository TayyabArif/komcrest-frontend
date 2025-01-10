import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { CircleCheckBig } from "lucide-react";

import { useMyContext } from "@/context";

const ChangeSubscription = () => {
  const { plansData } = useMyContext();
  const [billingType, setBillingType] = useState("monthly");
  return (
    <div className="w-full">
      <div className="flex gap-6 justify-center my-2">
        <button
          className={`px-4 py-2 text-[18px] font-semibold cursor-pointer border-b-2 ${
            billingType === "monthly" ? "border-blue-700" : "border-transparent"
          }`}
          onClick={() => setBillingType("monthly")}
        >
          Monthly
        </button>
        <button
          className={`px-4 py-2 text-[18px] font-semibold cursor-pointer border-b-2 ${
            billingType === "annual" ? "border-blue-700" : "border-transparent"
          }`}
          onClick={() => setBillingType("annual")}
        >
          Annual
        </button>
      </div>
      <div className="">
        <div className="flex flex-wrap  gap-x-[30px] gap-y-4 w-[95%] mx-auto">
          {plansData
            ?.filter(
              (item) =>
                item.planType === "free" || item.billingCycle == billingType
            )
            .map((data, index) => (
              <div
                key={index}
                style={{ backgroundColor: data.cardColor }}
                className="w-[30%] p-4 bg-white group rounded-md lg:hover:-translate-y-1 ease-in duration-300 border xl:border-none border-[#0B0641]"
              >
                <div className="flex flex-row gap-5 items-center">
                  <span className="text-xl font-bold mb-5">{data.name}</span>
                </div>
                <div className="my-0 space-y-3">
                  <p className="font-semibold text-standard flex items-center gap-2">
                    <CircleCheckBig size={18} /> {data.benefits?.Questions}{" "}
                    Questions
                  </p>
                  <p className="font-semibold text-standard flex items-center gap-2">
                    <CircleCheckBig size={18} /> {data.benefits?.Questionnaires}{" "}
                    Questionnaires
                  </p>
                  <p className="font-semibold text-standard flex items-center gap-2">
                    <CircleCheckBig size={18} /> Un Limited Documents
                  </p>
                  <p className="font-semibold text-standard flex items-center gap-2">
                    <CircleCheckBig size={18} /> Un Limited Online Resource
                  </p>
                  <p className="font-semibold text-standard flex items-center gap-2">
                    <CircleCheckBig size={18} /> Day support
                  </p>
                </div>
                <div className="border border-dashed border-[#A9A9AA] tracking-widest my-4" />

                <div className="bottom-6 left-6 right-6 ">
                  <div className="flex justify-between items-center">
                    <span className="text-[32px] font-bold ">{data.price}</span>

                    {data.planType !== "free" && (
                      <Button
                        size="md"
                        color="primary"
                        className="global-success-btn"
                      >
                        {index == 1 ? "Activated" : "Upgrade"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ChangeSubscription;
