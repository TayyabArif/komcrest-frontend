import React,{useState}from 'react'
import { useDropzone } from "react-dropzone";
import Dropzone from 'react-dropzone';
import * as XLSX from 'xlsx';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import SelectHeaderRow from './SelectHeaderRow';

const UploadFile = ({setExcelData, setStepper, setProgressBar}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
  
    const handleDrop = (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        debugger
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        setExcelData(jsonData);
        onClose()
        setStepper(1)
        setProgressBar(35)
      };
      reader.readAsArrayBuffer(file);
    };
  
    const dropzoneStyle = {
      border: '2px dashed #ccc',
      padding: '20px',
      textAlign: 'center',
      cursor: 'pointer',
    };
   
    return (
      <div>
        <table className="table-auto border-[1px] border-collapse border-gray-400 w-full text-sm">
          <thead>
            <tr className='text-left'>
              <th className="border border-black px-2 py-2">Product</th>
              <th className="border border-black px-2 py-2">Category</th>
              <th className="border border-black px-2 py-2">Question</th>
              <th className="border border-black px-2 py-2">Coverage</th>
              <th className="border border-black px-2 py-2">Answer</th>
              <th className="border border-black px-2 py-2">Roadmap</th>
              <th className="border border-black px-2 py-2">Curator</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-[#ebeef2] ">
              <td className="border border-black px-2 py-2">Komcrest</td>
              <td className="border border-black px-2 py-2">Organization</td>
              <td className="border border-black px-2 py-2">Do you have a team or resources dedicated to IT Security?</td>
              <td className="border border-black px-2 py-2">Yes</td>
              <td className="border border-black px-2 py-2">The team is composed of 2 experts dedicated to drive the IT security roadmap. Plan to recruit a dedicated Security Architect</td>
              <td className="border border-black px-2 py-2">Q4 2024</td>
              <td className="border border-black px-2 py-2">Richard Branco</td>
            </tr>
          </tbody>
        </table>
  
        <div className='flex justify-center'>
          <Button
            onPress={onOpen}
            radius="none"
            size="sm"
            className="text-white px-[10px] text-[15px] 2xl:text-[20px] cursor-pointer font-semibold bg-btn-primary w-max rounded-[4px] my-4"
          >
            Add documents
          </Button>
        </div>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <ModalHeader>Upload File</ModalHeader>
            <ModalBody>
              <p className='font-[600]'>Select the questionnaire you want to index</p>
              <Dropzone onDrop={handleDrop} accept=".xlsx, .xls">
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} style={dropzoneStyle}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop an Excel file here, or click to select one</p>
            </div>
          )}
        </Dropzone>
            </ModalBody>
            <ModalFooter className='flex items-start justify-start -mt-4'>
              <Button onClick={onClose} radius="none" size="sm" className="text-red-400 px-[10px] text-[15px] 2xl:text-[20px] cursor-pointer font-semibold bg-red-300 w-max rounded-[4px] my-3">
                Cancel
              </Button>
              <Button onClick={onClose} radius="none" size="sm" className="text-white px-[10px] text-[15px] 2xl:text-[20px] cursor-pointer font-semibold bg-btn-primary w-max rounded-[4px] my-3">
                Upload
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    );
  };
  
  export default UploadFile;
  