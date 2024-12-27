import React from "react";
import { Euro } from "lucide-react";
import { PRICING_DATA } from "@/constants";

const ChoosePlan = ({ selectedPlan, setSelectedPlan }) => {
  return (
    <div>
      <h1 className="text-[40px]">Your subscription</h1>
      <h4>Select the desired subscription level</h4>
      <div className="flex justify-evenly gap-10 my-5">
        {PRICING_DATA.slice(1).map((item) => (
          <div
            key={item.name}
            className={`w-[250px] rounded text-center p-5 space-y-1 cursor-pointer ${
              selectedPlan === item.name ? "border-4 border-black" : ""
            }`}
            style={{ backgroundColor: item.cardColor }}
            onClick={() => setSelectedPlan(item.name)}
          >
            <h1 className="text-[24px] font-extrabold">{item.name}</h1>

            {item.benefits.slice(0, 2).map((list, index) => (
                <p className="font-semibold text-[16px]">{list}</p>
            ))}

            <p className="font-semibold text-[16px]"></p>
            <div className="flex items-center justify-center font-extrabold">
              <Euro size={25} style={{ strokeWidth: 3 }} />
              <span className="text-[25px]">{item.price}</span>
            </div>
            <p className="font-semibold text-[16px]">per month excluding tax</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChoosePlan;
