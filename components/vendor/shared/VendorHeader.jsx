import React from "react";
import { useRouter } from 'next/router';
import { Button } from "@nextui-org/react";

const VendorHeader = ({buttonShow , headerData}) => {
  // debugger
  console.log("========",headerData)
 
  const router = useRouter()
  return (
    <div className="bg-gray-50 py-2">
      <div className="flex justify-between w-[85%] mx-auto">
      <div className="flex flex-col justify-center ">
        <h1 className="font-semibold text-[15px] 2xl:text-[20px]">Documents</h1>
        <p className="text-[15px] 2xl:text-[20px]">Quickly add common docs to your account.</p>
      </div>
      {
        buttonShow &&
         <Button
         radius="none"
         size="sm"
         className="text-white text-sm  2xl:text-[20px] bg-btn-primary w-max rounded-[4px] my-4"
         onClick={() => {
         router.push("/vendor/document/AddDocument")}}
       >
         Add documents
       </Button>
      }
     </div>
    </div>
  );
};

export default VendorHeader;
