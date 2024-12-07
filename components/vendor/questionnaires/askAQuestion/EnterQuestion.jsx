import React from "react";
import { useMyContext } from "@/context";
import { Button, Textarea, Checkbox } from "@nextui-org/react";

const EnterQuestion = () => {
  const { companyProducts } = useMyContext();
  return (
    <div className="w-[32%] bg-white h-[500px] px-5 py-3">
      <h1 className="p-2 font-semibold">Ask a question</h1>
      <hr
        style={{ height: "2px", backgroundColor: "#D8D8D8", border: "none" }}
      />

      <div className="p-2 space-y-4">
        <div>
          <label className="text-[16px] 2xl:text-[20px]">
            Associated product(s) <span className="text-red-500">*</span>
          </label>
          <div className="gap-x-6 gap-y-2 flex flex-wrap my-1">
            {companyProducts?.map((item, index) => (
              <Checkbox
                key={index}
                //   isSelected={questionnaireData.productIds?.includes(
                //     item.id
                //   )}
                //   onChange={() => handleCheckboxChange("products", item.id)}
                className="2xl:text-[20px] !text-[50px]"
                radius="none"
                size="lg"
                classNames={{ wrapper: "!rounded-[3px]" }}
              >
                {item.name}
              </Checkbox>
            ))}
          </div>
        </div>
        <div className="mt-2 mb-3">
          <label className="text-[16px] 2xl:text-[20px]">
            Question <span className="text-red-500">*</span>
          </label>
          <Textarea
            variant="bordered"
            // size="sm"
            minRows={8}
            placeholder="Type the question here"
            name="description"
            //   value={questionnaireData.description}
            //   onChange={handleData}
            classNames={{
              input: "text-[16px] 2xl:text-[20px]  text-gray-500",
            }}
          />
        </div>
        <div className="flex justify-end">
          <Button
            size="md"
            color="primary"
            className="rounded-md 2xl:text-[20px] cursor-pointer text-[16px] font-semibold"
            //   onClick={questionnaireUpdated}
          >
            Ask a question
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnterQuestion;
