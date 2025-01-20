import React, { useState } from "react";
import { Euro } from "lucide-react";
import { useMyContext } from "@/context";

const ChoosePlan = ({ planId, setPlanId, setFormErrors }) => {
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

  const selectPlan = (selectPlan) => {
    setPlanId(selectPlan);
    setFormErrors((prev) => ({
      ...prev,
      plan: "",
    }));
  };

  const getMinRangeQuestionnaire = (name) => {
    switch (name) {
      case "Essential":
        return "3";
      case "Standard":
        return "5";
      case "Professional":
        return "10";

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <h1 className="md:text-[35px] text-[30px]">Votre abonnement</h1>
      <h4 className="text-standard">
        Sélectionnez le niveau d&apos;abonnement souhaité
      </h4>

      <div className="flex gap-6 justify-center md:my-5 my-3">
        <button
          className={`px-4 py-2 text-[18px] font-semibold cursor-pointer border-b-2 ${
            billingType === "monthly" ? "border-blue-700" : "border-transparent"
          }`}
          onClick={() => setBillingType("monthly")}
        >
          Mensuel
        </button>
        <button
          className={`px-4 py-2 text-[18px] font-semibold cursor-pointer border-b-2 ${
            billingType === "annual" ? "border-blue-700" : "border-transparent"
          }`}
          onClick={() => setBillingType("annual")}
        >
          Annuel
        </button>
      </div>

      <div className="sm:flex justify-evenly flex-wrap lg:gap-10 gap-5 w-full  my-5 md:space-y-0 space-y-3">
        {plansData
          .filter((item) => item.billingCycle == billingType)
          .sort((a, b) => a.id - b.id  )
          .map((item) => (
            <div
              key={item.name}
              className={`md:w-[28%] sm:w-[30%]  w-full  rounded text-center p-5 space-y-1 cursor-pointer ${
                planId == item.id ? "border-4 border-black" : ""
              }`}
              style={{ backgroundColor: getCardColor(item.name) }}
              onClick={() => selectPlan(item.id)}
            >
              <h1 className="text-[24px] font-extrabold">{item.name}</h1>

              <p className="font-semibold text-standard">
                {item.benefits?.Questions} Questions
              </p>
              <p className="font-semibold text-standard">
                ~ {getMinRangeQuestionnaire(item.name)} à{" "}
                {item.benefits?.Questionnaires} Questionnaires
              </p>
              {/* <p className="font-semibold text-standard">Un Limited Documents</p>
              <p className="font-semibold text-standard">
                Un Limited Online Resource
              </p>
              <p className="font-semibold text-standard">Day support</p> */}

              <div className="flex items-center justify-center font-extrabold">
                <Euro size={25} style={{ strokeWidth: 3 }} />
                <span className="text-[25px]">{item.price}</span>
              </div>
              <p className="font-semibold text-[16px]">
                Par {item.billingCycle === "annual" ? "annuelle" : "mois"} hors
                taxe
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChoosePlan;
