import React from 'react'
import { ThumbsUp ,ThumbsDown ,FilePenLine } from 'lucide-react';


const KnowledgeHistory = ({questionReferenceData }) => {
  
  return (
    <div className="max-w-md mx-auto   flex flex-col gap-5">
      {questionReferenceData?.length > 0 ? (
      questionReferenceData.map((item, index) => (
    <div key={index} className="bg-[#FFFFFF] rounded-md p-4 space-y-3">
      <p className="font-bold">Question: <span className="font-normal">{item.question}</span></p>
      <p className="font-bold">Compliance: <span className="font-normal">{item.coverage}</span></p>
      <p className="font-bold">Answer: <span className="font-normal">{item.answer}</span></p>
      <div className="flex justify-end space-x-4 mt-2">
        <FilePenLine className="cursor-pointer text-gray-500" size={18} />
        <ThumbsUp className="cursor-pointer text-gray-500" size={18} />
        <ThumbsDown className="cursor-pointer text-gray-500" size={18} />
      </div>
    </div>
  ))
) : (
  <p >No reference found</p>
)}

    </div>
  )
}

export default KnowledgeHistory