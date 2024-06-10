import React from "react";
import { useRouter } from 'next/router';
import { Button } from "@nextui-org/react";

const DocumentHeader = ({buttonShow}) => {
 
  const router = useRouter()
  return (
    <div className="bg-gray-50 py-2 px-[6rem] flex justify-between">
      <div className="">
        <h1 className="font-semibold">Documents</h1>
        <p className="text-[14px]">Quickly add common docs to your account.</p>
      </div>
      {
        buttonShow &&
         <Button
         radius="none"
         size="sm"
         className="text-white px-[10px] text-sm bg-btn-primary w-max rounded-[4px] my-4"
         onClick={() => {
         router.push("/vendor/document/AddDocument")}}

       >
         Add documents
       </Button>
      }
     
    </div>
  );
};

export default DocumentHeader;
