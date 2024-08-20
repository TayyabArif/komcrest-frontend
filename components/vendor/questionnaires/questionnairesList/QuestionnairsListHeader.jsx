import React from "react";
import { Button } from "@nextui-org/react";
import { Settings } from "lucide-react";
const QuestionnairsListHeader = () => {
  return (
    <div className="bg-gray-50 py-2">
      <div className="flex justify-between items-center  w-[85%] mx-auto">
        <div className="leading-7 flex gap-5">
          <p className="text-[16px] 2xl:text-[20px]">Questionnaires</p>
          <p className="text-[16px] 2xl:text-[20px]">
            {" "}
            ABC - 2021 CAIQ Questionnaire 20210914
          </p>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <select className="w-[150px]  bg-[#D8D8D8] text-[18px] border rounded-lg pr-3 p-[5px]">
              <option value="" disabled>
                Select
              </option>
              <option value="document">Document</option>
              <option value="online">Online</option>
              <option value="knowledge">Knowledge</option>
            </select>
            <Button
              radius="none"
              size="sm"
              className="text-white text-sm  2xl:text-[20px] bg-btn-primary w-max rounded-[4px] my-4"
            >
              Export .XLS
            </Button>
            <div className="bg-[#D8D8D8] py-1 px-[6px] rounded-md">
              <Settings className="text-[#252525] " />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnairsListHeader;
