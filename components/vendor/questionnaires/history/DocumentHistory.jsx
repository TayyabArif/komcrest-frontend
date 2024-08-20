import React from 'react'
import { ThumbsUp ,ThumbsDown ,FilePenLine } from 'lucide-react';
const documentReferences = [
    {
      title: "2021 CAIQ Questionnaire 20210914",
      pages: "4, 12",
    },
    {
      title: "SOC 2 certificate",
      pages: "9",
    },
    {
      title: "SOC 2 certificate",
      pages: "9",
    },
  ];
  

const DocumentHistory = () => {
  return (
    <div className="max-w-md mx-auto bg-bg-[#FFFFFF] ">
    <h2 className="text-lg font-bold mb-4">Document references</h2>
    {documentReferences.map((doc, index) => (
      <div key={index} className="bg-white shadow-md rounded-md p-4 mb-4">
        <a href="#" className="text-blue-600 font-bold block mb-1">{doc.title}</a>
        <div className='flex justify-between'>
        <p className="text-sm text-gray-600 mb-2">Pages: {doc.pages}</p>
        <div className="flex justify-end space-x-4 mt-2">
            <FilePenLine className="cursor-pointer text-gray-500" size={18} />
            <ThumbsUp className="cursor-pointer text-gray-500" size={18} />
            <ThumbsDown className="cursor-pointer text-gray-500" size={18} />
          </div>

          </div>
      </div>
    ))}
  </div>
  )
}

export default DocumentHistory