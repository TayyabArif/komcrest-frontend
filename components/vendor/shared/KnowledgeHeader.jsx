import React from "react";
import { useRouter } from "next/router";
import { Button } from "@nextui-org/react";

const KnowledgeHeader = ({ buttonShow, headerData }) => {
  const router = useRouter();
  return (
    <div className="bg-gray-50 py-2">
      <div className="flex justify-between  w-[85%] mx-auto">
        <div className="leading-5">
          <h1 className="font-semibold text-[16px] 2xl:text-[23px] mb-4">
            {headerData?.title}
          </h1>
          <p className="text-[16px] 2xl:text-[20px]">{headerData?.desc1}</p>
          <p className="text-[15px] 2xl:text-[20px] mt-1">
            {headerData?.desc2} 
          </p>
        </div>
        <div>
          {buttonShow && (
            <div>
              {headerData.leftButtonText && (
                <Button
                  radius="none"
                  size="md"
                  className="bg-white border text-[16px]  2xl:text-[20px] w-max rounded-[4px] my-4 mx-2"
                  onClick={() => {
                    router.push(headerData?.leftButtonPath);
                  }}
                >
                  {headerData.leftButtonText}
                </Button>
              )}

              {headerData.rightButtonText && (
                <Button
                  radius="none"
                  size="md"
                  className="text-white text-[16px]  2xl:text-[20px] bg-btn-primary w-max rounded-[4px] my-4"
                  onClick={() => {
                    router.push(headerData.rightButtonPath);
                  }}
                >
                  {headerData.rightButtonText}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeHeader;
