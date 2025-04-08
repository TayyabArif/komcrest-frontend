import React from "react";
import { useRouter } from "next/router";
import { Button } from "@nextui-org/react";
import { toast } from "react-toastify";
import { useMyContext } from "@/context";

const KnowledgeHeader = ({ buttonShow, headerData }) => {
  const { activePlanDetail } = useMyContext();
  const router = useRouter();
  return (
    <>
      {headerData && (
        <div className="bg-gray-50 py-1">
          <div className="flex justify-between items-center  w-[85%] mx-auto">
            <div className="">
              <h1 className="font-bold text-[18px] 2xl:text-[25px]">
                {headerData?.title}
              </h1>
              <p className="text-standard">{headerData?.desc1}</p>
              <p className="text-standard ">{headerData?.desc2}</p>
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
                        if (
                          headerData.title == "Questionnaires" &&
                          activePlanDetail?.subscriptionDetails?.status ==
                            "cancelled"
                        ) {
                          toast.error("No Plan Active");
                        } else {
                          router.push(headerData.rightButtonPath);
                        }
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
      )}
    </>
  );
};

export default KnowledgeHeader;
