import React from "react";
import { AlignLeft, FileText, SquareCheck, CircleHelp,Settings } from "lucide-react";
import { useCookies } from 'react-cookie';
import { useRouter } from "next/router";



const DocumentLayout = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['myCookie']); 
  const router = useRouter()
  

  function handleLogout(){
    removeCookie('myCookie', { path: '/' }); 
    router.push("/vendor/login/access")
  }
  return (
    <div className="flex w-full min-h-screen">
      <div className="flex flex-col gap-5 w-[15%]   pb-5">
        <p className="text-lg bg-slate-50 py-2 px-4">
          <span className="font-bold">Komcrest</span> Vendor
        </p>
        <div className="flex flex-col justify-between h-full ">
          <div className="flex flex-col gap-2">
            <div className="flex gap-1 items-center px-4  bg-gray-100 cursor-pointer">
              <FileText size={20} />
              <p className="text-lg font-normal  py-1">Documents</p>
            </div>
            <div className="flex gap-1 items-center px-4 cursor-pointer">
              <AlignLeft size={20} />
              <p className="text-lg font-normal  py-1">Knowledge</p>
            </div>

            <div className="flex gap-1 items-center px-4 cursor-pointer">
              <SquareCheck size={20} />
              <p className="text-lg font-normal py-1">Questionnaires</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 cursor-pointer">
            <div className="flex gap-1 items-center px-4">
              <CircleHelp size={20} />
              <p className="text-lg font-normal  py-1 ">Help Center</p>
            </div>

            <div className="flex gap-1 items-center px-4 cursor-pointer">
              <Settings size={20} />
              <p className="text-lg font-normal  py-1">Settings</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[85%]">
        <div className=" py-2 text-right px-10 font-bold cursor-pointer" onClick={handleLogout}><h1>Logout</h1></div>
      <div className="flex flex-col  bg-slate-100 ">
        {children}
      </div>
      </div>
    </div>
  );
};

export default DocumentLayout;
