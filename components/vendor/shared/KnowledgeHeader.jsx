import React from "react";
import { useRouter } from "next/router";
import { Button } from "@nextui-org/react";

const KnowledgeHeader = ({ buttonShow, headerData }) => {
  const router = useRouter();
  return (
    <div className="bg-gray-50 py-2">
      <div className="flex justify-between items-center  w-[85%] mx-auto">
        <div className="leading-5">
          <h1 className="font-bold text-[18px] 2xl:text-[25px] mb-2">
            {headerData?.title}
          </h1>
          <p className="text-standard">{headerData?.desc1}</p>
          <p className="text-standard mt-1">
            {headerData?.desc2} 
          </p>
        </div>
        <div>
          {buttonShow && (
            <div className="flex gap-3">
              {headerData.leftButtonText && (
                <Button
                  radius="none"
                  size="md"
                  className="bg-white border text-[16px]  2xl:text-[20px] w-max rounded-[4px]"
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
                  className="global-success-btn"
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
