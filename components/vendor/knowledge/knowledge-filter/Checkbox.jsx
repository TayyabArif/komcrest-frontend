import React from "react";
import { Checkbox } from "@nextui-org/react";

const CheckboxComponent = ({options, selectedValues, handleFilterChange }) => {
  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="text-standard">
        {options?.map((data) => (
          <div
            key={data.key}
            className="flex justify-between p-2 px-5 items-center border-b-2"
          >
            <Checkbox
              isSelected={selectedValues.includes(data.value)}
              onChange={() => handleFilterChange(data.value)}
              radius="none"
              size="lg"
              classNames={{
                label: "!rounded-[3px] text-standard",
                wrapper: "!rounded-[3px]" 
              }}
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
