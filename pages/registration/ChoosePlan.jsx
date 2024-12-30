import React, { useState } from "react";
import { Euro } from "lucide-react";
import { PRICING_DATA } from "@/constants";

const ChoosePlan = ({ companyPlan, setCompanyPlan }) => {
  const [billingCycle, setBillingCycle] = useState("monthly"); 

  const getPrice = (item) => {
    if (billingCycle === "annual") {
      switch (item.name) {
        case "Essential":
          return "$79";
        case "Standard":
          return "$159";
        case "Professional":
          return "$329";
        default:
          return item.price;
      }
    }
    return item.price;
  };

  return (
    <div>
      <h1 className="text-[40px]">Your subscription</h1>
      <h4>Select the desired subscription level</h4>
      <div className="flex gap-6 justify-center my-5">
        <button
          className={`px-4 py-2 text-[18px] font-semibold cursor-pointer border-b-2 ${
            billingCycle === "monthly" ? "border-blue-700" : "border-transparent"
          }`}
          onClick={() => setBillingCycle("monthly")}
        >
          Monthly
        </button>
        <button
          className={`px-4 py-2 text-[18px] font-semibold cursor-pointer border-b-2 ${
            billingCycle === "annual" ? "border-blue-700" : "border-transparent"
          }`}
          onClick={() => setBillingCycle("annual")}
        >
          Annual
        </button>
      </div>

      <div className="flex justify-evenly gap-10 my-5">
        {PRICING_DATA.slice(1).map((item) => (
          <div
            key={item.name}
            className={`w-[250px] rounded text-center p-5 space-y-1 cursor-pointer ${
              companyPlan.price === getPrice(item) && companyPlan.billingCycle === billingCycle ? "border-4 border-black" : ""
            }`}
            style={{ backgroundColor: item.cardColor }}
            onClick={() => setCompanyPlan({ price: getPrice(item), billingCycle , planName : item.name })}
          >
            <h1 className="text-[24px] font-extrabold">{item.name}</h1>

            {item.benefits.slice(0, 2).map((list, index) => (
              <p key={index} className="font-semibold text-[16px]">{list}</p>
            ))}

            <div className="flex items-center justify-center font-extrabold">
              <Euro size={25} style={{ strokeWidth: 3 }} />
              <span className="text-[25px]">{getPrice(item)}</span>
            </div>
            <p className="font-semibold text-[16px]">per {billingCycle === "annual" ? "year" : "month"} excluding tax</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChoosePlan;
