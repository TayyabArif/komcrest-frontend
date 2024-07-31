import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useDropzone } from "react-dropzone";
import Dropzone from "react-dropzone";
import { Select, SelectItem } from "@nextui-org/react";
import FileUploadModal from "../../shared/FileUploadModal";
import { handleDownload } from "@/helper";

const ReviewContent = ({
  resourceData,
  setResourceData,
  handleSelectChange,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
 const allowedFileTypes = ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"]

  const { isOpen, onOpen, onClose } = useDisclosure();
  const reIndexationMethods = [
    { key: "weekly", label: "Weekly" },
    { key: "monthly", label: "Monthly" },
    { key: "quarterly", label: "Quarterly" },
    { key: "onDemand", label: "On demand" },
    { key: "manual", label: "Manual" },
  ];

 
  const handleFileData = (file) => {
    setResourceData((prevData) => ({
      ...prevData,
      resources: prevData.resources.map((item, idx) =>
        idx === selectedIndex ? { ...item, file: file } : item
      ),
    }));

    onClose();
  };

  return (
    <div className="overflow-x-auto mt-10">
      <table className="min-w-full block md:table">
        <thead className="block md:table-header-group">
          <tr className="border text-[16px] 2xl:text-[20px] md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto md:relative">
            <th className="p-2 font-bold py-3 border border-[#b8b6b6] text-left block md:table-cell">
              Title
            </th>
            <th className="p-2 py-3 font-bold border border-[#b8b6b6] text-left block md:table-cell">
              URL
            </th>
            <th className="p-2 py-3 font-bold border border-[#b8b6b6] text-left block md:table-cell">
              Download
            </th>
            <th className="p-2 py-3 font-bold border border-[#b8b6b6] text-left block md:table-cell">
              Upload
            </th>
            <th className="p-2 py-3 font-bold border border-[#b8b6b6] text-left block md:table-cell">
              Indexation method
            </th>
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {resourceData?.resources?.map((item, index) => (
            <tr key={index} className="bg-white text-[16px] 2xl:text-[20px]">
              <td className="p-2 border border-[#b8b6b6] text-left block md:table-cell py-3">
                {item.title}
              </td>
              <td className="p-2 border border-[#b8b6b6] text-left block md:table-cell py-3">
                {item.url}
              </td>
              <td className="p-2 border border-[#b8b6b6] text-left block md:table-cell py-3">
                {item.file ? (
                  <div className="flex flex-col">
                    <span>Click to download Docx file</span>
                    <span
                      className="text-blue-500 hover:underline cursor-pointer"
                      onClick={() => handleDownload(item.file)}
                    >
                      {typeof item.file === "object" && item.file !== null
                        ? item.file.name
                        : item.file?.split("/").pop() || "No file"}
                    </span>
                  </div>
                ) : (
                  "Docx file not available"
                )}
              </td>
              <td className="p-2 border border-[#b8b6b6] text-left block md:table-cell py-3">
                <button
                  onClick={() => {
                    onOpen(), setSelectedIndex(index);
                  }}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Upload docx file
                </button>
              </td>
              <td className="p-2 border border-[#b8b6b6] text-left block md:table-cell py-3">
                <select
                  className="py-1 px-2 w-[90%]"
                  value={item.indexing}
                  onChange={(e) =>
                    handleSelectChange("indexing", e.target.value, index)
                  }
                >
                  {reIndexationMethods?.map((item, index) => (
                    <option key={index} value={item?.label}>
                      {item?.label}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <FileUploadModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        handleFileData={handleFileData}
        allowedFileTypes={allowedFileTypes}
      />
    </div>
  );
};

export default ReviewContent;
