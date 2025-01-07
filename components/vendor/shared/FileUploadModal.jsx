import React, { useState } from 'react'
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
import { toast } from 'react-toastify';

const FileUploadModal = ({ isOpen ,onClose ,handleFileData ,allowedFileTypes }) => {
    const [file , setFile] = useState({})
    const handleDrop = (acceptedFiles) => {
      const uploadedFile = acceptedFiles[0];
      if (uploadedFile && allowedFileTypes.includes(uploadedFile.type)) {
          setFile(uploadedFile);
      } else {
          toast.error('Invalid file type. Only .docx and .txt files are allowed.');
      }
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
    <ModalContent>
      <ModalHeader>Upload File</ModalHeader>
      <ModalBody>
        <p className="font-[600] text-[16px] 2xl:text-[20px] mb-2">
          Add the Docx file you want to index
        </p>
        <Dropzone onDrop={handleDrop} >
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-7 bg-gray-100 cursor-pointer"
            >
              <input {...getInputProps()} />
              <p className="text-center  font-bold italic 2xl:text-[20px]">
               {file.name ? file.name : " Drop file or click here to upload file"} 
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
          onClick={()=>handleFileData(file)}
          radius="none"
          size="sm"
          className="text-white px-3 h-[40px] text-[15px] 2xl:text-[20px] cursor-pointer font-semibold bg-btn-primary w-max rounded-[4px] my-3"
        >
          Upload
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
  )
}

export default FileUploadModal