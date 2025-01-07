import React from "react";

import { Textarea, Input } from "@nextui-org/react";

const GetAnswer = ({answerData}) => {
  return (
    <div className="w-[32%] bg-white h-[500px] px-5 py-3">
      <h1 className="p-2 font-bold">Get an answer</h1>
      <hr
        style={{ height: "2px", backgroundColor: "#D8D8D8", border: "none" }}
      />

      <div className="p-2 space-y-2">
        <div>
          <label className="text-[16px] 2xl:text-[20px]">Compliance</label>
          <Input
            type="text"
            variant="bordered"
            placeholder=""
            size="md"
            name="customerDomain"
              value={answerData?.compliance}
            //   onChange={handleData}
            classNames={{
              input: "2xl:text-[20px] text-[16px]",
            }}
          />
        </div>
        <div className="mt-2 mb-3">
          <label className="text-[16px] 2xl:text-[20px]">Answer</label>
          <Textarea
            variant="bordered"
            // size="sm"
            minRows={8}
            placeholder=""
            name="description"
              value={answerData?.answer}
            //   onChange={handleData}
            classNames={{
              input: "text-[16px] 2xl:text-[20px] ",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GetAnswer;
