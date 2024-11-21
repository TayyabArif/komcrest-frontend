import React from "react";
import { FilePenLine } from "lucide-react";
import {
  FaRegThumbsDown,
  FaThumbsDown,
  FaRegThumbsUp,
  FaThumbsUp,
} from "react-icons/fa";
import { useRouter } from "next/router";

const DocumentHistory = ({
  documentReferenceData,
  setDocumentReferenceData,
  statusUpdate,
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
          <div key={index} className="bg-white shadow-md rounded-md p-4 mb-4  break-words">
            <a
              href="#"
              className="text-blue-600 font-bold block mb-1 2xl:text-[20px] text-[16px] "
            >
              {doc.title}
            </a>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600 mb-2 2xl:text-[20px] text-[16px]">
                Pages: {doc.pageNumber}
              </p>
              <div className="flex justify-end space-x-4 mt-2">
                <FilePenLine
                  onClick={() =>
                    router.push(`/vendor/document/AddDocument?id=${doc?.id}`)
                  }
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
        <p className="2xl:text-[20px] text-[16px]">No reference found</p>
      )}
    </div>
  );
};

export default DocumentHistory;
