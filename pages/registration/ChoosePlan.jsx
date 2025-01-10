import React, { useState } from "react";
import { Euro } from "lucide-react";
import { useMyContext } from "@/context";

const ChoosePlan = ({ planId, setPlanId}) => {
  const [billingType, setBillingType] = useState("monthly");
  const { plansData } = useMyContext();

  const getCardColor = (name) => {
    switch (name) {
      case "Essential":
        return "#88AEFF";
      case "Standard":
        return "#01FFA3";
      case "Professional":
        return "#01CFFD";

      default:
        break;
    }
  };

  return (
    <div className="w-full">
      <h1 className="md:text-[40px] text-[33px]">Your subscription</h1>
      <h4>Select the desired subscription level</h4>
      <div className="flex gap-6 justify-center md:my-5 my-3">
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

      <div className="sm:flex justify-evenly flex-wrap lg:gap-10 gap-5 w-full  my-5 md:space-y-0 space-y-3">
        {plansData
          .filter((item) => item.billingCycle == billingType)
          .map((item) => (
            <div
              key={item.name}
              className={`md:w-[28%] sm:w-[30%]  w-full  rounded text-center p-5 space-y-1 cursor-pointer ${planId == item.id ? "border-4 border-black" : "" }`}
              style={{ backgroundColor: getCardColor(item.name) }}
              onClick={() => setPlanId(item.id)}
            >
              <h1 className="text-[24px] font-extrabold">{item.name}</h1>

              <p className="font-semibold text-[16px]">
                {item.benefits?.Questions} Questions
              </p>
              <p className="font-semibold text-[16px]">
                {item.benefits?.Questionnaires} Questionnaires
              </p>
              <p className="font-semibold text-[16px]">Un Limited Documents</p>
              <p className="font-semibold text-[16px]">
                Un Limited Online Resource
              </p>
              <p className="font-semibold text-[16px]">Day support</p>

              <div className="flex items-center justify-center font-extrabold">
                <Euro size={25} style={{ strokeWidth: 3 }} />
                <span className="text-[25px]">{item.price}</span>
              </div>
              <p className="font-semibold text-[16px]">
                per {item.billingCycle === "annual" ? "year" : "month"}{" "}
                excluding tax
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChoosePlan;
