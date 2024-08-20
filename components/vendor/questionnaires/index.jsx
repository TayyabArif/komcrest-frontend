import React, { useState } from "react";
import { Settings } from "lucide-react";
import KnowledgeHeader from "../shared/KnowledgeHeader";
import NotifyModal from "./notifyModal";
import { useDisclosure, Progress } from "@nextui-org/react";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";

const headerData = {
  title: "Questionnaires",
  desc1:
    "Streamline the process of responding to complex IT security assessments thanks to our AI-powered assistant.",
  desc2:
    "Upload your questionnaire and Komcrest will provides accurate and tailored answers, saving time and ensuring consistency.",
  addSingle: "Add questionnaire",
  singlePath: "/vendor/questionnaires/import",
};

const steps = [
  {
    title: "To process",
    content:
      "No questionnaires in the queue at the moment, but our system is primed and ready. When you're set to go, we'll process your submissions instantly.",
  },
  {
    title: "Started",
    content:
      "Currently, no questionnaires are active in our system. The queue is empty and awaiting new submissions.",
  },
  {
    title: "For Review",
    content:
      "No questionnaires are currently awaiting review. Your review queue is empty at the moment.",
  },
  {
    title: "Approved",
    content:
      "No questionnaires have received approval yet. The approved list is currently empty.",
  },
];

const Questionnaires = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [openPopoverIndex, setOpenPopoverIndex] = useState(null);
  return (
    <div>
      <KnowledgeHeader headerData={headerData} buttonShow={true} />
      <div className="w-[86%] mx-auto py-2 px-2">
        <div className="flex gap-5 text-[16px] 2xl:text-[20px] py-2 ">
          {/* <h1
            onClick={() => {
              onOpen();
            }}
          >
            notify
          </h1> */}
          <h1 className="text-blue-700">In progress</h1>
          <h1>Completed</h1>
        </div>
        <div className="my-3 flex gap-2">
          {steps.map((data, index) => (
            <div key={index} className=" flex-1 ">
              <div
                className="flex gap-3 items-center border-2 py-[6px] px-2 rounded-lg bg-white"
              >
                <span
                  className={`flex items-center justify-center rounded-full w-[27px] h-[27px] text-center border-2 bg-[#EBEEF2]`}
                >
                  {index + 1}
                </span>
                <h1 className="text-[16px] 2xl:text-[20px]">{data.title}</h1>
              </div>
              <h1 className="p-2">{data.content}</h1>
            </div>
          ))}
          <NotifyModal isOpen={isOpen} onOpenChange={onOpenChange} />
        </div>
      </div>
      {/* <div className="bg-white shadow-lg rounded-lg p-4 w-80">
        <div className="font-bold text-lg text-black mb-2">
          <h6>Abc</h6>
          <h6>2021 CAIQ Questionnaire 20210914</h6>
        </div>

        <div className=" text-gray-500">
          <div>
            <span className="font-bold  text-black"> Creation date </span>August
            5 16h30
          </div>
          <div>By Richard Branco</div>
        </div>

        <div>
          <span className="font-bold  text-black"> Last Update </span> August 5
          16h30
        </div>
        <div>By Richard Branco</div>

        <div className=" font-bold mt-4">
          Due date{" "}
          <span>
            31<sup>st</sup> August 2024
          </span>
        </div>
        <div className="flex  items-center gap-4">
          <div className="relative h-[9px] w-full">
            <Progress
              aria-label="Loading..."
              value={80}
              className="h-[9px] absolute "
              classNames={{
                indicator: "bg-[#ffc001]",
              }}
              style={{ width: "100%" }}
            />

            <Progress
              aria-label="Loading..."
              value={40}
              classNames={{
                indicator: "bg-[#00B050]",
              }}
              className="h-[9px] absolute"
              style={{ width: "100%" }}
            />
          </div>
          <Popover
            className="rounded-[0px]"
            // isOpen={openPopoverIndex === index}
            // onOpenChange={(open) => setOpenPopoverIndex(open ? index : null)}
          >
            <PopoverTrigger>
              <Settings
                size={20}
                className="cursor-pointer"
                color="#2457d7"
                strokeWidth={2}
              />
            </PopoverTrigger>
            <PopoverContent>
              <div className="px-3 py-2 space-y-1.5">
                <div className="text-small cursor-pointer ">
                  Download original questionnaire
                </div>

                <div className="text-small cursor-pointer ">Update info</div>

                <div className="text-small text-red-600 cursor-pointer ">
                  Delete
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div> */}
    </div>
  );
};

export default Questionnaires;
