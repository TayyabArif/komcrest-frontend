import React from "react";
import { Input, Checkbox } from "@nextui-org/react";

const CompanyPlan = ({ formData, setFormData }) => {
  const companyPlan = [
    { key: "Free", label: "Free" },
    { key: "Essential", label: "Essential" },
    { key: "Standard", label: "Standard" },
    { key: "Professional", label: "Professional" },
  ];

  const handleCheckboxChange = (key) => {
    setFormData((prev) => ({
      ...prev,
      companyPlan: key, 
    }));
  };

  return (
    <div className="flex flex-col bg-white shadow-md w-[48%] min-h-[300px] pb-10 mt-5">
      <p className="px-4 py-4 border-1.5 border-b-gray-200 border-r-0 border-l-0 border-t-0 font-semibold">
        Company Plan
      </p>
      <div className="gap-x-6 px-4 py-5 flex flex-col gap-4">
        {companyPlan.map((item, index) => (
          <Checkbox
            key={index}
            size="md"
            isSelected={formData.companyPlan === item.key} 
            onChange={() => handleCheckboxChange(item.key)}
            className="2xl:text-[20px] text-[16px]"
            radius="none"
            classNames={{ wrapper: "!rounded-[3px]" }}
          >
            {item.label}
          </Checkbox>
        ))}
      </div>
    </div>
  );
};

export default CompanyPlan;
