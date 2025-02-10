import React, { useState } from "react";
import { useMyContext } from "@/context";
import { Button, Textarea, Checkbox } from "@nextui-org/react";

const EnterQuestion = ({setAskQuestion, askQuestion, handleSubmit ,isLoading}) => {
  const { companyProducts } = useMyContext();
  

  // Handle checkbox changes
  const handleCheckboxChange = (productId) => {
    setAskQuestion((prevState) => {
      const newProductIds = prevState.productIds.includes(productId)
        ? prevState.productIds.filter((id) => id !== productId)
        : [...prevState.productIds, productId];
      return { ...prevState, productIds: newProductIds };
    });
  };

  // Handle textarea change
  const handleQuestionChange = (event) => {
    const { value } = event.target;
    setAskQuestion((prevState) => ({
      ...prevState,
      question: value,
    }));
  };


  return (
    <div className="w-[32%] bg-white h-[500px] px-5 py-3 rounded">
      <h1 className="p-2 font-bold 2xl:text-[20px] text-[16px]">Ask a question</h1>
      <hr
        style={{ height: "2px", backgroundColor: "#E4E4E7", border: "none" }}
      />

      <div className="p-2 space-y-4">
        <form onSubmit={handleSubmit}>
          <div className="pb-1">
            <label className="text-standard">
              Associated product(s) <span className="text-red-500">*</span>
            </label>
            <div className="gap-x-6 gap-y-2 flex flex-wrap my-1">
              {companyProducts?.map((item, index) => (
                <Checkbox
                  key={index}
                  isSelected={askQuestion.productIds.includes(item.id)} // Check if product is selected
                  onChange={() => handleCheckboxChange(item.id)} // Handle checkbox change
                  radius="none"
                      size="lg"
                      classNames={{
                        label: "!rounded-[3px] text-standard",
                        wrapper: "!rounded-[3px]" 
                      }}
                >
                  {item.name}
                </Checkbox>
              ))}
            </div>
          </div>
          <div className="mt-2 mb-3">
            <label className="text-standard">
              Question <span className="text-red-500">*</span>
            </label>
            <Textarea
              variant="bordered"
              minRows={8}
              radius="sm"
              placeholder="Type the question here"
              value={askQuestion.question}
              onChange={handleQuestionChange} 
              classNames={{
                input: "text-standard",
              }}
            />
          </div>
          <div className="flex justify-end">
            <Button
              size="md"
              color="primary"
              className="rounded-md 2xl:text-[20px] cursor-pointer text-[16px] font-semibold"
              isLoading={isLoading}
              type="submit" // Make the button submit the form
            >
              Ask a question
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnterQuestion;
