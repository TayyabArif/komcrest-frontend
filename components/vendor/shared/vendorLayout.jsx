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
import FreeTrialCompletedModal from "./FreeTrialCompletedModal";
import { useDisclosure } from "@nextui-org/react";

const VendorLayout = ({ children }) => {
  const {
    setIsKnowledgeBaseOpenDirect,
    activePlanDetail,
    plansData,
    handleCreateCheckout,
    isLoading,
  } = useMyContext();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const route = router.route;
  const userID = cookiesData?.userId;
  const [loggedInUser, setLoggedInUser] = useState();
  const [isFreeTrialEnd, setIsFreeTrialEnd] = useState(
    isCurrentDateGreaterThanEndDate() ||
      activePlanDetail?.questionLimitDetails?.questionsLeft == 0
  );
  const [selectedItem, setSelectedItem] = useState("");
  const currentDate = new Date();

  useEffect(() => {
    const parts = route.split("/");
    const segment = parts[2];
    setSelectedItem(segment);
    setLoggedInUser(cookiesData && cookiesData.userName);
  }, [route]);

  function handleLogout() {
    removeCookie("myCookie", { path: "/" });
    router.push("/vendor/login/access");
    localStorage.removeItem("selectedSideBar");
    toast.success("Logout Successfully");
  }

  function isCurrentDateGreaterThanEndDate() {
    const endDate = new Date(activePlanDetail?.subscriptionDetails?.endDate);
    const currentDate = new Date();

    return currentDate > endDate;
  }

  function getDayDifference() {
    const endData = new Date(activePlanDetail?.subscriptionDetails?.endDate);
    const currentDate = new Date();
    const milliseconds = endData - currentDate;

    // Calculate days, hours, and minutes
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

    let result = "";

    // If the difference is more than a day, show days
    if (days > 0) {
      result += `${days} day${days > 1 ? "s" : ""}`;
    }
    // If less than a day, only show hours and minutes
    else {
      if (hours > 0) {
        result += `${hours} hour${hours > 1 ? "s" : ""}`;
      }
      if (minutes > 0) {
        result += `${minutes} minute${minutes > 1 ? "s" : ""}`;
      }
    }

    // If no days, hours, or minutes are greater than zero, return "0 day"
    if (result.trim() === "") {
      result = "0 day";
    }

    // Return the result
    return result.trim();
  }

  function planActivated() {
    const selectedPlanId =
      activePlanDetail?.subscriptionDetails?.selectedPlanId;
    const selectedPlan = plansData?.find((item) => item.id == selectedPlanId);
    if (selectedPlan?.name == "Free") {
      router.push("/vendor/setting/subscription-plan");
    } else {
      handleCreateCheckout(selectedPlan);
    }
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
              <h1 className="text-standard py-2">Documents</h1>
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
              <h1 className="text-standard py-2">Online Resources</h1>
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
              <h1 className="text-standard py-2">Knowledge</h1>
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
              <h1 className="text-standard py-2 ">Questionnaires</h1>
            </div>
          </div>

          <div className="flex flex-col gap-2 cursor-pointer">
            <div className="flex gap-1 items-center px-4">
              <CircleHelp size={20} />
              <h1 className=" text-standard py-2">Help Center</h1>
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
              <h1 className="text-standard py-2">Settings</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="ml-[15%] w-[85%] fixed h-screen pb-4">
        <div className=" flex justify-end w-[85%] mx-auto">
          {activePlanDetail?.subscriptionDetails?.planName == "Free" && (
            <div className="py-[6px] flex-1  bg-y text-right flex items-center gap-2 font-bold cursor-pointer  m-auto text-standard">
              <Button
                radius="none"
                size="md"
                className="global-success-btn"
                // isLoading={isLoading}
                onClick={() => planActivated()}
              >
                Activate Plan
              </Button>
              <h1 className="text-blue-700 text-standard">
                Trial period: {getDayDifference()} &{" "}
                {activePlanDetail?.questionLimitDetails?.questionsLeft}{" "}
                questions left (unlimited documents & knowledge base entries)
              </h1>
            </div>
          )}
          <div className="py-[6px] justify-end text-right flex  items-center gap-2 font-bold cursor-pointer  text-standard">
            <h1>{loggedInUser}</h1>
            <Button
              radius="none"
              size="md"
              className=" px-[20px] text-standard font-semibold bg-[#D8D8D8] w-max rounded-[4px]"
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

      <FreeTrialCompletedModal
        isOpen={isFreeTrialEnd && route !== "/vendor/setting/subscription-plan"}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        planActivated={planActivated}
      />
    </div>
  );
};

export default VendorLayout;
