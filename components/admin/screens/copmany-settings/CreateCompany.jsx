import React from "react";
import CompanyInfoCard from "./CompanyInfoCard";
import CompanyProductCard from "./CompanyProductCard";
import { Button } from "@nextui-org/react";

const CreateCompany = () => {
  return (
    <div className="flex flex-col w-full bg-white">
      <div className="flex justify-end font-bold pl-20 pr-10 py-2">Logout</div>
      <div className="flex flex-col justify-between w-full gap-5 pl-20 pr-10 py-10 bg-gray-200 min-h-screen ">
        <div className="flex items-center justify-start w-full gap-10 pl-20">
          <CompanyInfoCard />
          <CompanyProductCard />
        </div>
        <div className="flex justify-end mb-5 pr-16">
          <div>
            <p className="mb-1 text-red-600 text-sm mb-1 font-semibold">
              Verify information before confirming
            </p>
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
              >
                Send invitation
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* <CompaniesTable /> */}
    </div>
  );
};

export default CreateCompany;
