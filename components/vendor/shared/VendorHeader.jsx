import React from "react";
import { useRouter } from 'next/router';
import { Button } from "@nextui-org/react";

const VendorHeader = ({buttonShow , headerData}) => {
 
  const router = useRouter()
  return (
    <div className="bg-gray-50 py-2">
      <div className="flex justify-between w-[85%] mx-auto">
      <div className="flex flex-col justify-center ">
        <p className="font-bold text-[18px] 2xl:text-[25px]">Documents</p>
        <p className="text-standard text-black">Quickly add common docs to your account.</p>
      </div>
      {
        buttonShow &&
         <Button
         radius="none"
         size="md"
         className="global-success-btn my-4"
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
