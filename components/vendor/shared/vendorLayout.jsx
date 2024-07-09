import React, { useState, useEffect } from "react";
import { AlignLeft, FileText, SquareCheck, CircleHelp, Settings } from "lucide-react";
import { useCookies } from 'react-cookie';
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const VendorLayout = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['myCookie']); 
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState("documents");
  
  function handleLogout() {
    removeCookie('myCookie', { path: '/' }); 
    router.push("/vendor/login/access");
    localStorage.removeItem("selectedSideBar");
    toast.success("Logout Successfully");
  }

  useEffect(() => {
    const item = localStorage.getItem("selectedSideBar");
    if (item) setSelectedItem(item);
  }, []);
  
  return (
    <div className="flex w-full min-h-screen">
      <div className="flex flex-col gap-5 w-[15%] pb-5 fixed min-h-screen">
        <p className="text-lg bg-slate-50 py-2 px-4 md:text-[19px] 2xl:text-[25px]">
          <span className="font-bold">Komcrest</span> Vendor
        </p>
        <div className="flex flex-col justify-between h-[92vh]">
          <div className="flex flex-col gap-2">
            <div className={`flex gap-1 items-center px-4 cursor-pointer ${selectedItem === "documents" ? "bg-gray-200" : ""}`} 
              onClick={() => { 
                router.push("/vendor/document");
                localStorage.setItem("selectedSideBar", "documents");
              }}>
              <FileText size={20} />
              <h1 className="text-[18px] 2xl:text-[20px] py-2">Documents</h1>
            </div>
            <div className={`flex gap-1 items-center px-4 cursor-pointer ${selectedItem === "knowledge" ? "bg-gray-200" : ""}`} 
              onClick={() => { 
                router.push("/vendor/knowledge");
                localStorage.setItem("selectedSideBar", "knowledge");
              }}>
              <AlignLeft size={20} />
              <h1 className="text-[18px] 2xl:text-[20px] py-2">Knowledge</h1>
            </div>
            <div className={`flex gap-1 items-center px-4 cursor-pointer ${selectedItem === "Questionnaires" ? "bg-gray-200" : ""}`}
              onClick={() => { 
                localStorage.setItem("selectedSideBar", "Questionnaires");
              }}>
              <SquareCheck size={20} />
              <h1 className="text-[18px] 2xl:text-[20px] py-2">Questionnaires</h1>
            </div>
          </div>
          <div className="flex flex-col gap-2 cursor-pointer">
            <div className="flex gap-1 items-center px-4">
              <CircleHelp size={20} />
              <h1 className="text-lg text-[18px] 2xl:text-[20px] py-2">Help Center</h1>
            </div>
            <div className="flex gap-1 items-center px-4 cursor-pointer">
              <Settings size={20} />
              <h1 className="font-normal text-[18px] 2xl:text-[20px] py-2">Settings</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="ml-[15%] w-[85%]">
        <div className="py-2 text-right font-bold cursor-pointer w-[85%] m-auto 2xl:text-[20px]" onClick={handleLogout}>
          <h1>Logout</h1>
        </div>
        <div className="flex flex-col bg-[#ebeef2] min-h-[95vh] overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default VendorLayout;
