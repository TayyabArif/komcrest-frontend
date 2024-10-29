import React from 'react'
import { ThumbsUp ,ThumbsDown ,FilePenLine } from 'lucide-react';

const DocumentHistory = ({documentReferenceData}) => {
  return (
    <div className="max-w-md mx-auto bg-bg-[#FFFFFF]">
   {documentReferenceData?.length > 0 ? (
  documentReferenceData.map((doc, index) => (
    <div key={index} className="bg-white shadow-md rounded-md p-4 mb-4">
      <a href="#" className="text-blue-600 font-bold block mb-1 2xl:text-[20px] text-[16px]">{doc.title}</a>
      <div className='flex justify-between'>
        <p className="text-sm text-gray-600 mb-2 2xl:text-[20px] text-[16px]">Pages: {doc.pageNumber}</p>
        <div className="flex justify-end space-x-4 mt-2">
          <FilePenLine className="cursor-pointer text-gray-500" size={18} />
          <ThumbsUp className="cursor-pointer text-gray-500" size={18} />
          <ThumbsDown className="cursor-pointer text-gray-500" size={18} />
        </div>
      </div>
    </div>
  ))
) : (
  <p>No reference found</p>
)}

  </div>
  )
}

export default DocumentHistory