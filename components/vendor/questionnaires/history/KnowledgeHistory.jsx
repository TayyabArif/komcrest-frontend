import React from "react";
import { ThumbsUp, ThumbsDown, FilePenLine } from "lucide-react";
import {
  FaRegThumbsDown,
  FaThumbsDown,
  FaRegThumbsUp,
  FaThumbsUp,
} from "react-icons/fa";
import { useRouter } from "next/router";
import Link from "next/link";

const KnowledgeHistory = ({
  questionReferenceData,
  setQuestionReferenceData,
  statusUpdate,
  isButtonClickAble,
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
    <div className="max-w-md mx-auto  flex flex-col gap-5">
      {questionReferenceData?.length > 0 ? (
        questionReferenceData.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded p-4 space-y-3 text-standard break-words "
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
              {/* <FilePenLine
                onClick={() =>
                  window.open(
                    `/vendor/knowledge/UpdateQuestion?id=${item?.id}`,
                    "_blank"
                  )
                }
                className="cursor-pointer text-gray-500"
                size={18}
              /> */}

                <Link
                  href={`/vendor/knowledge/UpdateQuestion?id=${item?.id}`}
                  target="_blank" 
                >
                  <FilePenLine
                    className="cursor-pointer text-gray-500"
                    size={18}
                  />
                </Link>

              {isButtonClickAble && (
                <div className="flex items-center gap-3">
                  {item.referenceStatus == "like" ? (
                    <FaThumbsUp
                      className="text-blue-700"
                      size={18}
                      onClick={() => {
                        ReferenceStatusUpdate(
                          item.referenceRecordId,
                          "removeLike"
                        );
                      }}
                    />
                  ) : (
                    <FaRegThumbsUp
                      className="cursor-pointer text-gray-500"
                      size={18}
                      onClick={() => {
                        ReferenceStatusUpdate(item.referenceRecordId, "like");
                      }}
                    />
                  )}

                  {item.referenceStatus == "dislike" ? (
                    <FaThumbsDown
                      className="text-blue-700"
                      size={18}
                      onClick={() => {
                        ReferenceStatusUpdate(
                          item.referenceRecordId,
                          "removeDislike"
                        );
                      }}
                    />
                  ) : (
                    <FaRegThumbsDown
                      className="cursor-pointer text-gray-500"
                      size={18}
                      onClick={() => {
                        ReferenceStatusUpdate(
                          item.referenceRecordId,
                          "dislike"
                        );
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-standard">No reference found</p>
      )}
    </div>
  );
};

export default KnowledgeHistory;
