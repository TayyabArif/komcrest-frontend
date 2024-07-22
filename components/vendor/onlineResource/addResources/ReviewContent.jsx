import React from "react";
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

const ReviewContent = ({ formData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const reIndexationMethods = [
    { key: "weekly", label: "Weekly"},
    { key: "monthly", label: "Monthly"},
    { key: "quarterly", label: "Quarterly"},
    { key: "onDemand", label: "On demand"},
    { key: "manual", label: "Manual"}
  ];
  return (
    <div className="overflow-x-auto mt-10">
      <table className="min-w-full block md:table">
        <thead className="block md:table-header-group">
          <tr className="border md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto md:relative">
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
          {formData.links?.map((item, index) => (
            <tr key={index} className="bg-white">
              <td className="p-2 border border-[#b8b6b6] text-left block md:table-cell py-3">
                {item.title}
              </td>
              <td className="p-2 border border-[#b8b6b6] text-left block md:table-cell py-3">
                {item.url}
              </td>
              <td className="p-2 border border-[#b8b6b6] text-left block md:table-cell py-3">
                {item.download ? (
                  <a
                    href={item.download}
                    className="text-blue-500 hover:underline"
                  >
                    {item.download}
                  </a>
                ) : (
                  "Docx file not available"
                )}
              </td>
              <td className="p-2 border border-[#b8b6b6] text-left block md:table-cell py-3">
                <button
                  onClick={onOpen}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Upload docx file
                </button>
              </td>
              <td className="p-2 border border-[#b8b6b6] text-left block md:table-cell py-3">
                <select className="py-1 px-2 w-[90%]">
                  {reIndexationMethods?.map((item, index) => (
                    <option key={index} value={item?.value}>
                      {item?.label}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalContent>
          <ModalHeader>Upload File</ModalHeader>
          <ModalBody>
            <p className="font-[600] text-[16px] 2xl:text-[20px] mb-2">
              Add the Docx file you want to index
            </p>
            <Dropzone accept=".xlsx, .xls">
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-7 bg-gray-100 cursor-pointer"
                >
                  <input {...getInputProps()} />
                  <p className="text-center text-gray-700 font-bold italic 2xl:text-[20px]">
                    Drop file or click here to upload file
                  </p>
                </div>
              )}
            </Dropzone>
          </ModalBody>
          <ModalFooter className="flex items-start justify-start -mt-2">
            <Button
              onClick={onClose}
              radius="none"
              size="sm"
              className="text-red-700 px-3 h-[40px] text-[15px] 2xl:text-[20px] cursor-pointer font-semibold bg-red-300 w-max rounded-[4px] my-3"
            >
              Cancel
            </Button>
            <Button
              onClick={onClose}
              radius="none"
              size="sm"
              className="text-white px-3 h-[40px] text-[15px] 2xl:text-[20px] cursor-pointer font-semibold bg-btn-primary w-max rounded-[4px] my-3"
            >
              Upload
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ReviewContent;
