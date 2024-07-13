import React from "react";
import { Checkbox } from "@nextui-org/react";

const categoryOption = [
  { key: "Overview", label: "Overview" },
  { key: "Access Management", label: "Access Management" },
  { key: "Application & Data Security", label: "Application & Data Security" },
  { key: "Artificial Intelligence", label: "Artificial Intelligence" },
  { key: "Cloud Security", label: "Cloud Security" },
  { key: "Device Management", label: "Device Management" },
  { key: "Disaster Recovery", label: "Disaster Recovery" },
  { key: "ESG", label: "ESG" },
  { key: "Incident Management", label: "Incident Management" },
  { key: "Legal", label: "Legal" },
  { key: "Privacy", label: "Privacy" },
  {
    key: "Risk and Vulnerability Management",
    label: "Risk and Vulnerability Management",
  },
  { key: "Security Governance", label: "Security Governance" },
  { key: "Vendor Management", label: "Vendor Management" },
];

const Category = ({ selectedValues, handleFilterChange }) => {
  return (
    <div className="w-full h-full bg-white flex flex-col justify-between">
      <div className="text-[18px]">
        {categoryOption.map((data) => (
          <div
            key={data.key}
            className="flex justify-between p-2 px-5 items-center border-b-2"
          >
            <Checkbox
              size="sm"
              radius="sm"
              isSelected={selectedValues.includes(data.label)}
              onChange={() => handleFilterChange(data.label)}
            >
              {data.label}
            </Checkbox>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
