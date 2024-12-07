import React, { useState } from "react";

import { Textarea, Input } from "@nextui-org/react";
import { ChevronRight, ChevronDown } from "lucide-react";

import KnowledgeHistory from "../history/KnowledgeHistory";
import DocumentHistory from "../history/DocumentHistory";
import OnlineResourceHistory from "../history/OnlineResourceHistory";

const Reference = () => {
  const [referenceToggle, setReferenceToggle] = useState({
    isKnowledgeOpen: true,
    isDocumentOpen: true,
    isOnlineOpen: true,
  });
  const iconProps = {
    size: 18,
    strokeWidth: 6,
    className: "text-[#2457D7]",
  };
  return (
    <div className="w-[23%] bg-[#F2F2F2] h-[500px] px-5 py-3">
      <h1 className="p-2 font-semibold">Reference</h1>
      <hr
        style={{ height: "2px", backgroundColor: "#D8D8D8", border: "none" }}
      />

      <div className="space-y-4 mt-5">
        <div
          className="flex justify-between items-center 2xl:text-[20px] text-[16px] cursor-pointer w-[60%]"
          onClick={() =>
            setReferenceToggle((prevState) => ({
              ...prevState,
              isDocumentOpen: !prevState.isDocumentOpen,
            }))
          }
        >
          <h1 className="2xl:text-[20px] text-[16px] font-bold">Documents</h1>
          {referenceToggle.isDocumentOpen ? (
            <ChevronDown {...iconProps} />
          ) : (
            <ChevronRight {...iconProps} />
          )}
        </div>
        {referenceToggle.isDocumentOpen && (
          <DocumentHistory
          //   documentReferenceData={documentReferenceData}
          //   statusUpdate={statusUpdate}
          //   setDocumentReferenceData={setDocumentReferenceData}
          />
        )}

        <div
          className="flex justify-between items-center 2xl:text-[20px] text-[16px] cursor-pointer w-[60%]"
          onClick={() =>
            setReferenceToggle((prevState) => ({
              ...prevState,
              isKnowledgeOpen: !prevState.isKnowledgeOpen,
            }))
          }
        >
          {" "}
          <h1 className="2xl:text-[20px] text-[16px] font-bold">
            Knowledge Base
          </h1>
          {referenceToggle.isKnowledgeOpen ? (
            <ChevronDown {...iconProps} />
          ) : (
            <ChevronRight {...iconProps} />
          )}
        </div>
        {referenceToggle.isKnowledgeOpen && (
          <KnowledgeHistory
          //   questionReferenceData={questionReferenceData}
          //   statusUpdate={statusUpdate}
          //   setQuestionReferenceData={setQuestionReferenceData}
          />
        )}

        <div
          className="flex justify-between items-center 2xl:text-[20px] text-[16px] cursor-pointer w-[60%]"
          onClick={() =>
            setReferenceToggle((prevState) => ({
              ...prevState,
              isOnlineOpen: !prevState.isOnlineOpen,
            }))
          }
        >
          <h1 className="2xl:text-[20px] text-[16px] font-bold">
            Online Reference
          </h1>
          {referenceToggle.isOnlineOpen ? (
            <ChevronDown {...iconProps} />
          ) : (
            <ChevronRight {...iconProps} />
          )}
        </div>
        {referenceToggle.isOnlineOpen && (
          <OnlineResourceHistory
          //   onlineResourceReferenceData={onlineResourceReferenceData}
          //   statusUpdate={statusUpdate}
          //   setOnlineResourceReferenceData={setOnlineResourceReferenceData}
          />
        )}
      </div>
    </div>
  );
};

export default Reference;
