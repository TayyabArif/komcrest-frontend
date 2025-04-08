import React from "react";
import VendorHeader from "../shared/VendorHeader";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";
import { MonitorDown } from "lucide-react";
import KnowledgeHeader from "../shared/KnowledgeHeader";

const ResourceHome = () => {
  const router = useRouter();

  return (
    <div className=" py-7  min-h-[85vh] flex items-center justify-center">
      <div className="text-center w-[43%] mx-auto my-5 space-y-3">
        <div className="flex justify-center items-center">
          <MonitorDown size={150} className="text-[#2457d7]" />
        </div>
        <div>
        <h1 className="font-semibold text-[16px] 2xl:text-[20px] w-[85%] mx-auto ">
          Our intelligent system will analyse and indexes your added content.
        </h1>
        <p className="text-[16px] 2xl:text-[20px] w-[85%] mx-auto ">
          By incorporating diverse online resources, you’ll expand your
          information repository and improve the accuracy and relevance of
          AI-generated answers.
        </p>
        </div>
        <Button
          radius="none"
          size="sm"
          className="text-white px-[10px] text-[16px] 2xl:text-[20px] cursor-pointer font-semibold py-5 bg-btn-primary w-max rounded-[4px]"
          onClick={() => router.push("/vendor/onlineResource/addResources")}
        >
          Add online sources
        </Button>
      </div>
    </div>
  );
};

export default ResourceHome;
