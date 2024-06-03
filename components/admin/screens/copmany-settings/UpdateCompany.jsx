import React, { useState } from "react";
import CompanyInfoCard from "./CompanyInfoCard";
import CompanyProductCard from "./CompanyProductCard";
import { Button } from "@nextui-org/react";
import {useDisclosure} from "@nextui-org/react";
import ConfirmationModal from "../../shared/ConfirmationModal";

const modalData = {
  heading: "Create Company",
  desc: "Verify information before confirming",
  confirmText: "Update company"
}

const UpdateCompany = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <div className="flex flex-col w-full bg-white">
      <div className="flex justify-end font-bold pl-20 pr-10 py-2">Logout</div>
      <div className="flex flex-col justify-between w-full gap-5 pl-20 pr-10 py-10 bg-gray-200 min-h-screen ">
        <div className="flex justify-start w-full gap-10 pl-20">
          <CompanyInfoCard action="update"/>
          <CompanyProductCard action="update"/>
        </div>
        <div className="flex justify-end mb-5 pr-16">
          <div>
            <div className="flex items-center gap-5">
              <Button
                radius="none"
                size="sm"
                className="text-[#c51317] px-5 h-[28px] text-sm bg-[#f5c8d1] font-bold w-max rounded-[4px]"
              >
                Cancel
              </Button>
              <Button
                radius="none"
                size="sm"
                className="text-white px-5 h-[28px] text-sm bg-btn-primary w-max rounded-[4px]"
                onPress={onOpen}
              >
                Update Company
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal isOpen={isOpen} onOpenChange ={onOpenChange} data={modalData}/>
    </div>
  );
};

export default UpdateCompany;
