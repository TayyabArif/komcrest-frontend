import React, { useState } from "react";
import { X } from "lucide-react";
import KnowledgeHistory from "./KnowledgeHistory";
import DocumentHistory from "./DocumentHistory";
import OnlineResourceHistory from "./OnlineResourceHistory";

const History = () => {
  const [selectedOption, setSelectedOption] = useState("knowledge");

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="bg-[#F2F2F2] p-5">
      <div className="flex justify-between  items-center">
        <div className="flex items-center justify-between gap-10">
          <select
            className="w-[150px] text-[15px] border rounded-lg pr-3 p-2"
            value={selectedOption}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select
            </option>
            <option value="document">Document</option>
            <option value="online">Online</option>
            <option value="knowledge">Knowledge</option>
          </select>
          <h1 className="text-xl font-bold">History</h1>
        </div>
        <X />
      </div>

      {/* Conditionally render components based on selected option */}
      {selectedOption === "knowledge" && <KnowledgeHistory />}
      {selectedOption === "document" && <DocumentHistory />}
      {selectedOption === "online" && <OnlineResourceHistory />}
    </div>
  );
};

export default History;
