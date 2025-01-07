import React from "react";
import { ThumbsUp, ThumbsDown, FilePenLine } from "lucide-react";
import { handleDownload } from "@/helper";

import {
  FaRegThumbsDown,
  FaThumbsDown,
  FaRegThumbsUp,
  FaThumbsUp,
} from "react-icons/fa";
import { useRouter } from "next/router";
import Link from "next/link";

const OnlineResourceHistory = ({
  onlineResourceReferenceData,
  statusUpdate,
  setOnlineResourceReferenceData,
  isButtonClickAble,
}) => {
  const router = useRouter();

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
            className="bg-white shadow-md  rounded-md py-2 px-4 break-words"
          >
            <a
              href="#"
              onClick={() => handleDownload(doc.file)}
              className="text-blue-600 font-bold block mb-1 2xl:text-[20px] text-[16px] "
            >
              {doc.title}
            </a>
            <p className="2xl:text-[20px] text-[16px] break-words">
              {doc.referenceString}{" "}
            </p>
            <div className="flex justify-between items-center py-2">
              <p className=" 2xl:text-[20px] text-[15px]">
                Pages: {doc.pageNumber}
              </p>
              <div className="flex justify-end space-x-4">
                {/* <FilePenLine
                  onClick={() =>
                    window.open(
                      `/vendor/onlineResource/update?id=${doc?.id}`,
                      "_blank"
                    )
                  }
                  className="cursor-pointer text-gray-500"
                  size={18}
                /> */}

                <Link
                  href={`/vendor/onlineResource/update?id=${doc?.id}`}
                  target="_blank"
                >
                  <FilePenLine
                    className="cursor-pointer text-gray-500"
                    size={18}
                  />
                </Link>

                {isButtonClickAble && (
                  <div className="flex items-center gap-3">
                    {doc.referenceStatus == "like" ? (
                      <FaThumbsUp
                        className="text-blue-700"
                        size={18}
                        onClick={() => {
                          ReferenceStatusUpdate(
                            doc.referenceRecordId,
                            "removeLike"
                          );
                        }}
                      />
                    ) : (
                      <FaRegThumbsUp
                        className="cursor-pointer text-gray-500"
                        size={18}
                        onClick={() => {
                          ReferenceStatusUpdate(doc.referenceRecordId, "like");
                        }}
                      />
                    )}

                    {doc.referenceStatus == "dislike" ? (
                      <FaThumbsDown
                        className="text-blue-700"
                        size={18}
                        onClick={() => {
                          ReferenceStatusUpdate(
                            doc.referenceRecordId,
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
                            doc.referenceRecordId,
                            "dislike"
                          );
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="2xl:text-[20px] text-[16px]">No reference found</p>
      )}
    </div>
  );
};

export default OnlineResourceHistory;
