import React from "react";
import { Input, Checkbox } from "@nextui-org/react";
import { useMyContext } from "@/context";

const CompanyPlan = ({ formData, setFormData }) => {
  const { plansData } = useMyContext();

  const companyPlan = [
    { key: "Free", label: "Free" },
    { key: "Essential", label: "Essential" },
    { key: "Standard", label: "Standard" },
    { key: "Professional", label: "Professional" },
  ];

  const handleCheckboxChange = (id) => {
    setFormData((prev) => ({
      ...prev,
      planId: id,
    }));
  };

  return (
    <div className="flex flex-col bg-white shadow-md w-[48%] min-h-[300px] pb-10 mt-5">
      <p className="px-4 py-4 border-1.5 border-b-gray-200 border-r-0 border-l-0 border-t-0 font-semibold">
        Company Plan
      </p>

      <div className="px-4 pt-5 ">
        {plansData
          ?.filter((plan) => plan.name == "Free")
          ?.map((item, index) => (
            <Checkbox
              key={index}
              size="md"
              isSelected={formData.planId == item.id}
              onChange={() => handleCheckboxChange(item.id)}
              className="2xl:text-[20px] text-[16px]"
              radius="none"
              classNames={{ wrapper: "!rounded-[3px]" }}
            >
              {item.name}
            </Checkbox>
          ))}
      </div>

      <div className="flex">
        <div className="gap-x-6 px-4 py-2 flex flex-col gap-4">
          <p className="mt-2">Monthly</p>
          {plansData
            ?.filter((plan) => plan.billingCycle == "monthly")
            .sort((a, b) => a.id - b.id)
            ?.map((item, index) => (
              <Checkbox
                key={index}
                size="md"
                isSelected={formData.planId == item.id}
                onChange={() => handleCheckboxChange(item.id)}
                className="2xl:text-[20px] text-[16px]"
                radius="none"
                classNames={{ wrapper: "!rounded-[3px]" }}
              >
                {item.name}
              </Checkbox>
            ))}
        </div>

        <div className="gap-x-6 px-4 py-2 flex flex-col gap-4">
          <p className="mt-2">Annual</p>
          {plansData
            ?.filter((plan) => plan.billingCycle == "annual")
            .sort((a, b) => a.id - b.id)
            ?.map((item, index) => (
              <Checkbox
                key={index}
                size="md"
                isSelected={formData.planId == item.id}
                onChange={() => handleCheckboxChange(item.id)}
                className="2xl:text-[20px] text-[16px]"
                radius="none"
                classNames={{ wrapper: "!rounded-[3px]" }}
              >
                {item.name}
              </Checkbox>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyPlan;
