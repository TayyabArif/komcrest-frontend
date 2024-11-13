import React from "react";
import { ThumbsUp, ThumbsDown, FilePenLine } from "lucide-react";
import {
  FaRegThumbsDown,
  FaThumbsDown,
  FaRegThumbsUp,
  FaThumbsUp,
} from "react-icons/fa";
import { useRouter } from "next/router";

const KnowledgeHistory = ({
  questionReferenceData,
  setQuestionReferenceData,
  statusUpdate,
}) => {
  const router = useRouter();
  const ReferenceStatusUpdate = (referenceRecordId, type) => {
    setQuestionReferenceData((prev) => {
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
    <div className="max-w-md mx-auto   flex flex-col gap-5">
      {questionReferenceData?.length > 0 ? (
        questionReferenceData.map((item, index) => (
          <div
            key={index}
            className="bg-[#FFFFFF] rounded-md p-4 space-y-3 2xl:text-[20px] text-[16px] break-words "
          >
            <p className="font-bold ">
              Question: <span className="font-normal">{item.question}</span>
            </p>
            <p className="font-bold">
              Compliance: <span className="font-normal">{item.coverage}</span>
            </p>
            <p className="font-bold">
              Answer: <span className="font-normal">{item.answer}</span>
            </p>
            <div className="flex justify-end space-x-4 mt-2">
              <FilePenLine
                onClick={() =>
                  router.push(`/vendor/knowledge/UpdateQuestion?id=${item?.id}`)
                }
                className="cursor-pointer text-gray-500"
                size={18}
              />
              {item.referenceStatus == "like" ? (
                <FaThumbsUp
                  className="text-blue-700"
                  size={18}
                  onClick={() =>
                    ReferenceStatusUpdate(item.referenceRecordId, "removeLike")
                  }
                />
              ) : (
                <FaRegThumbsUp
                  className="cursor-pointer text-gray-500"
                  size={18}
                  onClick={() =>
                    ReferenceStatusUpdate(item.referenceRecordId, "like")
                  }
                />
              )}

              {item.referenceStatus == "dislike" ? (
                <FaThumbsDown
                  className="text-blue-700"
                  size={18}
                  onClick={() =>
                    ReferenceStatusUpdate(
                      item.referenceRecordId,
                      "removeDislike"
                    )
                  }
                />
              ) : (
                <FaRegThumbsDown
                  className="cursor-pointer text-gray-500"
                  size={18}
                  onClick={() =>
                    ReferenceStatusUpdate(item.referenceRecordId, "dislike")
                  }
                />
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="2xl:text-[20px] text-[16px]">No reference found</p>
      )}
    </div>
  );
};

export default KnowledgeHistory;
