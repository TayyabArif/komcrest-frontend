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
import Link from "next/link";

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
            className="bg-white rounded py-2 px-4 break-words"
          >
            <a
              href="#"
              onClick={() => handleFileDownload(doc.filePath)}
              className="text-blue-600 font-bold block mb-1 text-standard "
            >
              {doc.title} 
            </a>
            <p className="text-standard break-words ">
              {doc.referenceString}{" "}
            </p>
            <div className="flex justify-between items-center py-2">
              <p className="2xl:text-[20px] text-[15px]">
                Pages: {doc.pageNumber}
              </p>
              <div className="flex justify-end space-x-4 ">
                <Link
                  href={`/vendor/document/AddDocument?id=${doc?.id}`}
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
        <p className="text-standard">No reference found</p>
      )}
    </div>
  );
};

export default DocumentHistory;
