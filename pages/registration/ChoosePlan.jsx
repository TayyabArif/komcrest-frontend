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
    <div>
      <h1 className="text-[40px]">Your subscription</h1>
      <h4>Select the desired subscription level</h4>
      <div className="flex gap-6 justify-center my-5">
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

      <div className="flex justify-evenly gap-10 my-5">
        {plansData
          .filter((item) => item.billingCycle == billingType)
          .map((item) => (
            <div
              key={item.name}
              className={`w-[250px] rounded text-center p-5 space-y-1 cursor-pointer ${planId == item.id ? "border-4 border-black" : "" }`}
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
