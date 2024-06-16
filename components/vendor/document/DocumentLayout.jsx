import React from "react";
import { AlignLeft, FileText, SquareCheck, CircleHelp,Settings } from "lucide-react";
import { useCookies } from 'react-cookie';
import { useRouter } from "next/router";
import { toast } from "react-toastify";



const DocumentLayout = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['myCookie']); 
  const router = useRouter()
  
  function handleLogout(){
    removeCookie('myCookie', { path: '/' }); 
    router.push("/vendor/login/access")
    toast.success("Logout Successfully")
  }
  return (
    <div className="flex w-full min-h-screen">
      <div className="flex flex-col gap-5 lg:w-[15%] md:w-[20%] pb-5">
        <p className="text-lg bg-slate-50 py-2 px-4 md:text-[19px]">
          <span className="font-bold ">Komcrest</span> Vendor
        </p>
        <div className="flex flex-col justify-between h-full ">
          <div className="flex flex-col gap-2">
            <div className="flex gap-1 items-center px-4  bg-gray-100 cursor-pointer">
              <FileText size={20} />
              <h1 className="font-normal  py-1">Documents</h1>
            </div>
            <div className="flex gap-1 items-center px-4 cursor-pointer">
              <AlignLeft size={20} />
              <h1 className="font-normal  py-1">Knowledge</h1>
            </div>

            <div className="flex gap-1 items-center px-4 cursor-pointer">
              <SquareCheck size={20} />
              <h1 className="font-normal py-1">Questionnaires</h1>
            </div>
          </div>
          <div className="flex flex-col gap-2 cursor-pointer">
            <div className="flex gap-1 items-center px-4">
              <CircleHelp size={20} />
              <h1 className="text-lg font-normal  py-1 ">Help Center</h1>
            </div>

            <div className="flex gap-1 items-center px-4 cursor-pointer">
              <Settings size={20} />
              <h1 className=" font-normal  py-1">Settings</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[85%]">
        <div className=" py-2 text-right font-bold cursor-pointer w-[85%] m-auto" onClick={handleLogout}><h1>Logout</h1></div>
       <div className="flex flex-col  bg-[#ebeef2] h-full">
        {children}
      </div>
      </div>
    </div>
  );
};

export default DocumentLayout;
