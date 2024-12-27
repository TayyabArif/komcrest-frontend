import React, { useState, useEffect } from "react";
import {
  AlignLeft,
  FileText,
  SquareCheck,
  CircleHelp,
  Settings,
  MonitorDown,
  Building2,
} from "lucide-react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Button } from "@nextui-org/react";
import { useMyContext } from "@/context";

const VendorLayout = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const router = useRouter();
  const route = router.route;
  const userID = cookiesData?.userId;
  const [loogedinUser, setLoggdinUser] = useState();
  const [selectedItem, setSelectedItem] = useState("");
  const { setIsKnowledgeBaseOpenDirect } = useMyContext();
  useEffect(() => {
    const parts = route.split("/");
    const segment = parts[2];
    setSelectedItem(segment);
    setLoggdinUser(cookiesData && cookiesData.userName);
  }, [route]);

  function handleLogout() {
    removeCookie("myCookie", { path: "/" });
    router.push("/vendor/login/access");
    localStorage.removeItem("selectedSideBar");
    toast.success("Logout Successfully");
  }

  return (
    <div className="flex w-full">
      <div className="flex flex-col  w-[15%]  fixed h-screen">
        <p className="text-lg bg-slate-50 py-3 px-4 md:text-[19px] 2xl:text-[25px]">
          <span className="font-bold">Komcrest</span> Vendor
        </p>
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-2">
            <div
              className={`flex gap-1 items-center px-4 cursor-pointer ${
                selectedItem === "document"
                  ? "bg-[#2457d7] text-white shadow-md rounded"
                  : "hover:bg-gray-200 hover:shadow-md"
              }`}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey) {
                  // Check for Command (Mac) or Ctrl (Windows/Linux)
                  window.open("/vendor/document", "_blank");
                } else {
                  router.push("/vendor/document");
                }
              }}
            >
              <FileText size={20} />
              <h1 className="text-[16px] 2xl:text-[20px] py-2">Documents</h1>
            </div>

            <div
              className={`flex gap-1 items-center px-4 cursor-pointer ${
                selectedItem === "onlineResource"
                  ? "bg-[#2457d7] text-white shadow-md rounded"
                  : "hover:bg-gray-200 hover:shadow-md"
              }`}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey) {
                  window.open("/vendor/onlineResource", "_blank");
                } else {
                  router.push("/vendor/onlineResource");
                }
              }}
            >
              <MonitorDown size={20} />
              <h1 className="text-[16px] 2xl:text-[20px] py-2">
                Online Resources
              </h1>
            </div>

            <div
              className={`flex gap-1 items-center px-4 cursor-pointer ${
                selectedItem === "knowledge"
                  ? "bg-[#2457d7] text-white shadow-md rounded"
                  : "hover:bg-gray-200 hover:shadow-md"
              }`}
              onClick={(e) => {
                setIsKnowledgeBaseOpenDirect(true);
                if (e.metaKey || e.ctrlKey) {
                  window.open("/vendor/knowledge", "_blank");
                } else {
                  router.push("/vendor/knowledge");
                }
              }}
            >
              <AlignLeft size={20} />
              <h1 className="text-[16px] 2xl:text-[20px] py-2">Knowledge</h1>
            </div>

            <div
              className={`flex gap-1 items-center px-4 cursor-pointer ${
                selectedItem === "questionnaires"
                  ? "bg-[#2457d7] text-white shadow-md rounded"
                  : "hover:bg-gray-200 hover:shadow-md"
              }`}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey) {
                  window.open("/vendor/questionnaires", "_blank");
                } else {
                  router.push("/vendor/questionnaires");
                }
              }}
            >
              <SquareCheck size={20} />
              <h1 className="text-[16px] 2xl:text-[20px] py-2">
                Questionnaires
              </h1>
            </div>
          </div>

          <div className="flex flex-col gap-2 cursor-pointer">
            <div className="flex gap-1 items-center px-4">
              <CircleHelp size={20} />
              <h1 className=" text-[16px] 2xl:text-[20px] py-2">Help Center</h1>
            </div>
            <div
              className={`flex gap-1 items-center px-4 cursor-pointer ${
                selectedItem === "setting"
                  ? "bg-[#2457d7] text-white shadow-md rounded"
                  : "hover:bg-gray-200 hover:shadow-md"
              }`}
              onClick={() => {
                router.push(`/vendor/setting/update-account?id=${userID}`);
              }}
            >
              <Settings size={20} />
              <h1 className="text-[16px] 2xl:text-[20px] py-2">Settings</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="ml-[15%] w-[85%] fixed h-screen pb-4">
        <div className=" flex justify-between w-[85%] mx-auto">
          <div className="py-[6px] flex-1  bg-y text-right flex items-center gap-2 font-bold cursor-pointer  m-auto 2xl:text-[20px] text-[16px]">
            <Button
              radius="none"
              size="md"
              className=" px-[20px]  bg-btn-primary text-[16px] font-semibold text-white w-max rounded-[4px] 2xl:text-[20px] "
              onPress={handleLogout}
            >
              Activate Plan
            </Button>
            <h1 className="text-blue-700">
              Trial period: 7 days & 200 questions left (unlimited documents &
              knowledge base entries)
            </h1>
          </div>

          <div className="py-[6px]   justify-end text-right flex  items-center gap-2 font-bold cursor-pointer m-auto 2xl:text-[20px] text-[16px]">
            <h1>{loogedinUser}</h1>
            <Button
              radius="none"
              size="md"
              className=" px-[20px] text-[16px] font-semibold bg-[#D8D8D8] w-max rounded-[4px] 2xl:text-[20px] "
              onPress={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="flex flex-col bg-[#ebeef2] h-full  pb-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default VendorLayout;
