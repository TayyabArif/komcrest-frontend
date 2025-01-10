import React from "react";

import { Textarea, Input } from "@nextui-org/react";

const GetAnswer = ({answerData}) => {
  return (
    <div className="w-[32%] bg-white h-[500px] px-5 py-3 rounded">
      <h1 className="p-2 font-bold">Get an answer</h1>
      <hr
        style={{ height: "2px", backgroundColor: "#E4E4E7", border: "none" }}
      />

      <div className="p-2 space-y-2">
        <div className="">
          <label className="text-standard">Compliance</label>
          <Input
            type="text"
            variant="bordered"
            placeholder=""
            size="md"
            radius="sm"
            name="customerDomain"
              value={answerData?.compliance}
            //   onChange={handleData}
            classNames={{
              input: "2xl:text-[20px] text-[16px]",
            }}
          />
        </div>
        <div className="mt-2 mb-3">
          <label className="text-standard">Answer</label>
          <Textarea
            variant="bordered"
            // size="sm"
            radius="sm"
            minRows={8}
            placeholder=""
            name="description"
              value={answerData?.answer}
            //   onChange={handleData}
            classNames={{
              input: "text-standard ",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GetAnswer;
