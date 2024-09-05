import React, { useState } from "react";
import { X } from "lucide-react";
import KnowledgeHistory from "./KnowledgeHistory";
import DocumentHistory from "./DocumentHistory";
import OnlineResourceHistory from "./OnlineResourceHistory";
import HistoryDetail from "./HistoryDetail";

const History = ({selectedId ,setShowHistory ,setSelectedId}) => {
  const [selectedOption, setSelectedOption] = useState("references");
  const [referenceSelect, setReferenceSelect] = useState("Select");

  const handleChange = (event) => {
    setReferenceSelect(event.target.value);
  };

  return (
    <div className="bg-[#F2F2F2] px-5 h-screen overflow-scroll">
     <div className="flex justify-between  items-center sticky top-0 py-5 z-50 bg-[#F2F2F2] ">
        <div className="flex items-center justify-between gap-10">
           <h1 onClick={()=>{
            setSelectedOption("references")
            setReferenceSelect("document")
            }} className={`text-xl font-bold cursor-pointer ${selectedOption === "references" ? "text-blue-600" : ""} `}>References</h1>
          <h1 onClick={()=>setSelectedOption("history")} className={`text-xl font-bold cursor-pointer ${selectedOption === "history" ? "text-blue-600" : ""} `}>History</h1>
        </div>
        <X className="cursor-pointer"  onClick={()=>{
          setSelectedId(null)
          setShowHistory(false)}}/>
      </div>
      {selectedOption === "references" &&
        <div className="flex items-center mb-4">
          <select
              className="w-[150px] text-[15px] border rounded-lg pr-3 p-2"
              value={referenceSelect}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="document">Document</option>
              <option value="online">Online</option>
              <option value="knowledge">Knowledge</option>
            </select>
        </div>
      }
      {/* Conditionally render components based on selected option */}
      {(referenceSelect === "knowledge" && selectedOption === "references") && <KnowledgeHistory />}
      {(referenceSelect === "document" && selectedOption === "references") && <DocumentHistory />}
      {(referenceSelect === "online" && selectedOption === "references") && <OnlineResourceHistory />}
      {selectedOption === "history" && <HistoryDetail selectedId={selectedId}/>}
    </div>
  );
};

export default History;
