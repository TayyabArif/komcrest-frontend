import React, { useState } from "react";
import QuestionnairCard from "./QuestionnairCard";

const FilterStatus = ({ data, title, stepsContent, setDataUpdate}) => {
  return (
    <div className="w-full h-[60vh] ">
      <div className=" flex-1  space-y-4">
        <div className="flex gap-3 items-center border-2 py-[6px] px-2 rounded-lg bg-white">
          <span
            className={`flex items-center justify-center rounded-full w-[27px] h-[27px] text-center border-2 bg-[#EBEEF2]`}
          >
            1
          </span>
          <h1 className="text-[16px] 2xl:text-[20px]">{title}</h1>
        </div>
        {data?.length > 0 ? (
          data.map((data ,index) => {
            return <QuestionnairCard data={data} index={index} setDataUpdate={setDataUpdate}/>;
          })
        ) : (
          <h1 className="px-2">{stepsContent}</h1>
        )}
      </div>
    </div>
  );
};

export default FilterStatus;
