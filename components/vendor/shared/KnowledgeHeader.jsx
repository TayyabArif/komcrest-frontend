import React from "react";
import { useRouter } from 'next/router';
import { Button } from "@nextui-org/react";

const KnowledgeHeader = ({buttonShow , headerData}) => { 
  const router = useRouter()
  return (
    <div className="bg-gray-50 py-2">
      <div className="flex justify-between  w-[85%] mx-auto">
      <div className="leading-7">
        <h1 className="font-semibold text-[15px] 2xl:text-[25px] mb-4">Knowledge</h1>
        <p className="text-[18px] 2xl:text-[20px]">Quickly add requirements, questions and answers to your account.</p>
        <p className="text-[15px] 2xl:text-[20px] mt-1">They will be used by Komcrest AI to automatically provide the best answer to your future questions.</p>
      </div>
      <div>
      {
        buttonShow &&
        <div >
             <Button
         radius="none"
         size="sm"
         className="bg-white text-gray-500 border text-sm  2xl:text-[20px] w-max rounded-[4px] my-4 mx-2"
         onClick={() => {
          router.push("/vendor/knowledge/Import")}}
       >
         Import questions
       </Button>
       <Button
         radius="none"
         size="sm"
         className="text-white text-sm  2xl:text-[20px] bg-btn-primary w-max rounded-[4px] my-4"
         onClick={() => {
          router.push("/vendor/knowledge/AddQuestion")}}
       >
       
      
       Add a new question
       </Button>
        </div>
        
      }
      </div>
     </div>
    </div>
  );
};

export default KnowledgeHeader;
