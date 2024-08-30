import React from 'react'
import { ThumbsUp ,ThumbsDown ,FilePenLine } from 'lucide-react';

const knowledgeData = [
    {
      question: "Do you use industry standards to build in security for your Systems/Software Development Lifecycle (SDLC)?",
      compliance: "YES",
      answer: "We’re using the standard sanitisation components from the used frameworks.",
    },
    {
      question: "Do you use industry standards to build in security for your Systems/Software Development Lifecycle (SDLC)?",
      compliance: "YES",
      answer: "We’re using the standard sanitisation components from the used frameworks.",
    },
    {
      question: "Do you use industry standards to build in security for your Systems/Software Development Lifecycle (SDLC)?",
      compliance: "YES",
      answer: "We’re using the standard sanitisation components from the used frameworks.",
    },
  ];
const KnowledgeHistory = () => {
  return (
    <div className="max-w-md mx-auto   flex flex-col gap-5 overflow-scroll ">
      {knowledgeData.map((item, index) => (
        <div key={index} className="bg-[#FFFFFF] rounded-md p-4 space-y-3">
          <p className="font-bold">Question: <span className="font-normal">{item.question}</span></p>
          <p className="font-bold">Compliance: <span className="font-normal">{item.compliance}</span></p>
          <p className="font-bold">Answer: <span className="font-normal">{item.answer}</span></p>
          <div className="flex justify-end space-x-4 mt-2">
            <FilePenLine className="cursor-pointer text-gray-500" size={18} />
            <ThumbsUp className="cursor-pointer text-gray-500" size={18} />
            <ThumbsDown className="cursor-pointer text-gray-500" size={18} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default KnowledgeHistory