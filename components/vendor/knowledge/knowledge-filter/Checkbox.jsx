import React from "react";
import { Checkbox } from "@nextui-org/react";

const CheckboxComponent = ({options, selectedValues, handleFilterChange }) => {
  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="2xl:text-[20px] text-[16px]">
        {options?.map((data) => (
          <div
            key={data.key}
            className="flex justify-between p-2 px-5 items-center border-b-2"
          >
            <Checkbox
              size="lg"
              radius="sm"
              isSelected={selectedValues.includes(data.value)}
              onChange={() => handleFilterChange(data.value)}
            >
              {data.text}
            </Checkbox>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckboxComponent;
