import React from 'react'
import { ThumbsUp ,ThumbsDown ,FilePenLine } from 'lucide-react';
const OnlineResourceHistoryData = [
    {
      title: "2021 CAIQ Questionnaire 20210914",
      link : "Link",
      file : "File"
    },
    {
      title: "SOC 2 certificate",
      link : "Link",
      file : "File"
    },
    {
      title: "SOC 2 certificate",
      link : "Link",
      file : "File"
    },
  ];
  

const OnlineResourceHistory = () => {
  return (
    <div className="max-w-md mx-auto bg-bg-[#FFFFFF] ">
    <h2 className="text-lg font-bold mb-4">Document references</h2>
    {OnlineResourceHistoryData?.map((doc, index) => (
      <div key={index} className="bg-white shadow-md space-y-5 rounded-md py-2 px-4 mb-4">
       
        <a href="#" className="text-blue-600 font-bold block mb-1">{doc.title}</a>
        <div className='flex justify-between'>
        <div className='flex gap-7'>
        <p className="text-sm text-gray-600 mb-2">{doc.link}</p>
        <p className="text-sm text-gray-600 mb-2">{doc.file}</p>
        </div>
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

export default OnlineResourceHistory