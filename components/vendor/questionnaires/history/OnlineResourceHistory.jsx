import React from "react";
import { ThumbsUp, ThumbsDown, FilePenLine } from "lucide-react";
// import clickSound from "../../../../public/likeSound.mp3"

import {
  FaRegThumbsDown,
  FaThumbsDown,
  FaRegThumbsUp,
  FaThumbsUp,
} from "react-icons/fa";

const OnlineResourceHistory = ({
  onlineResourceReferenceData,
  statusUpdate,
  setOnlineResourceReferenceData,
}) => {

  const ReferenceStatusUpdate = (referenceRecordId, type) => {
    setOnlineResourceReferenceData((prev) => {
      const updated = prev.map((record) =>
        record.referenceRecordId === referenceRecordId
          ? { ...record, referenceStatus: type }
          : record
      );
      return updated;
    });

    statusUpdate(referenceRecordId, type);
  };

  return (
    <div className="max-w-md mx-auto bg-bg-[#FFFFFF] ">
      {onlineResourceReferenceData?.length > 0 ? (
        onlineResourceReferenceData.map((doc, index) => (
          <div
            key={index}
            className="bg-white shadow-md  rounded-md py-2 px-4 mb-4"
          >
            <a
              href="#"
              className="text-blue-600 font-bold block mb-1 2xl:text-[20px] text-[16px]  "
            >
              {doc.title}
            </a>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600 mb-2 2xl:text-[20px] text-[16px]">
                Pages: {doc.pageNumber}
              </p>
              <div className="flex justify-end space-x-4 mt-2">
                <FilePenLine
                  className="cursor-pointer text-gray-500"
                  size={18}
                />
                {doc.referenceStatus == "like" ? (
                  <FaThumbsUp
                    className="text-blue-700"
                    size={18}
                    onClick={() =>
                      ReferenceStatusUpdate(doc.referenceRecordId, "removeLike")
                    }
                  />
                ) : (
                  <FaRegThumbsUp
                    className="cursor-pointer text-gray-500"
                    size={18}
                    onClick={() =>
                      ReferenceStatusUpdate(doc.referenceRecordId, "like")
                    }
                  />
                )}

                {doc.referenceStatus == "dislike" ? (
                  <FaThumbsDown
                    className="text-blue-700"
                    size={18}
                    onClick={() =>
                      ReferenceStatusUpdate(
                        doc.referenceRecordId,
                        "removeDislike"
                      )
                    }
                  />
                ) : (
                  <FaRegThumbsDown
                    className="cursor-pointer text-gray-500"
                    size={18}
                    onClick={() =>
                      ReferenceStatusUpdate(doc.referenceRecordId, "dislike")
                    }
                  />
                )}
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
