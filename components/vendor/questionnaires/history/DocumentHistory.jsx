import React from "react";
import { FilePenLine } from "lucide-react";
import {
  FaRegThumbsDown,
  FaThumbsDown,
  FaRegThumbsUp,
  FaThumbsUp,
} from "react-icons/fa";
import { useRouter } from "next/router";
import { handleFileDownload } from "@/helper";

const DocumentHistory = ({
  documentReferenceData,
  setDocumentReferenceData,
  statusUpdate,
  isButtonClickAble,
}) => {
  const router = useRouter();

  const ReferenceStatusUpdate = (referenceRecordId, type) => {
    setDocumentReferenceData((prev) => {
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
    <div className="max-w-md mx-auto bg-bg-[#FFFFFF]">
      {documentReferenceData?.length > 0 ? (
        documentReferenceData.map((doc, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-md py-2 px-4 break-words"
          >
            <a
              href="#"
              onClick={() => handleFileDownload(doc.filePath)}
              className="text-blue-600 font-bold block mb-1 2xl:text-[20px] text-[16px] "
            >
              {doc.title}
            </a>
            <p className="2xl:text-[20px] text-[16px] break-words text-gray-600">
              {doc.referenceString}{" "}
            </p>
            <div className="flex justify-between items-center py-2">
              <p className=" text-gray-600  2xl:text-[20px] text-[15px]">
                Pages: {doc.pageNumber}
              </p>
              <div className="flex justify-end space-x-4 ">
                <FilePenLine
                  onClick={() =>
                    window.open(
                      `/vendor/document/AddDocument?id=${doc?.id}`,
                      "_blank"
                    )
                  }
                  className="cursor-pointer text-gray-500"
                  size={18}
                />
                {doc.referenceStatus == "like" ? (
                  <FaThumbsUp
                    className="text-blue-700"
                    size={18}
                    onClick={() => {
                      isButtonClickAble &&
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
                      isButtonClickAble &&
                        ReferenceStatusUpdate(doc.referenceRecordId, "like");
                    }}
                  />
                )}

                {doc.referenceStatus == "dislike" ? (
                  <FaThumbsDown
                    className="text-blue-700"
                    size={18}
                    onClick={() => {
                      isButtonClickAble &&
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
                      isButtonClickAble &&
                        ReferenceStatusUpdate(doc.referenceRecordId, "dislike");
                    }}
                  />
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

export default DocumentHistory;
