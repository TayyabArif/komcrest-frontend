import React from "react";
import { ThumbsUp, ThumbsDown, FilePenLine } from "lucide-react";

const OnlineResourceHistory = ({ onlineResourceReferenceData }) => {
  return (
    <div className="max-w-md mx-auto bg-bg-[#FFFFFF] ">
      {onlineResourceReferenceData?.length > 0 ? (
        onlineResourceReferenceData.map((doc, index) => (
          <div
            key={index}
            className="bg-white shadow-md space-y-5 rounded-md py-2 px-4 mb-4"
          >
            <a href="#" className="text-blue-600 font-bold block mb-1">
              {doc.title}
            </a>
            <div className="flex justify-between">
              <div className="flex gap-7">
                {/* You can uncomment these lines if you want to display the link or file */}
                {/* <p className="text-sm text-gray-600 mb-2">{doc.link}</p> */}
                {/* <p className="text-sm text-gray-600 mb-2">{doc.file}</p> */}
              </div>
              <div className="flex justify-end space-x-4 mt-2">
                <FilePenLine
                  className="cursor-pointer text-gray-500"
                  size={18}
                />
                <ThumbsUp className="cursor-pointer text-gray-500" size={18} />
                <ThumbsDown
                  className="cursor-pointer text-gray-500"
                  size={18}
                />
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No reference found</p>
      )}
    </div>
  );
};

export default OnlineResourceHistory;
