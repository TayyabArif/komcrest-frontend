import React, { useState } from "react";
import { useDisclosure } from "@nextui-org/react";
import ChangeSubscriptionModal from "./ChangeSubscriptionModal";
import { useCookies } from "react-cookie";
import ChangeSubscription from "./ChangeSubscription";
import Image from "next/image";
import CancelSubscriptionModal from "./CancelSubscriptionModal";
import { handleResponse } from "../../../helper";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useMyContext } from "@/context";

const Subscription = () => {
  const {activePlanDetail} = useMyContext();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isChangePlanClick, setIsChangePlanClick] = useState(false);
  const [cancelExplanation, setCancelExplanation] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const role = cookiesData?.role;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();

  const cancelSubscription = async () => {
    try {
      // Fetch the token from cookies
      const token = cookiesData?.token;
      if (!token) {
        toast.error("No token found. Please log in again.");
        return;
      }

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ feedback: cancelExplanation }),
        redirect: "follow",
      };

      const response = await fetch(
        `${baseUrl}/stripe/cancel-subscription`,
        requestOptions
      );

      // Check if the response is not okay
      if (!response.ok) {
        const data = await response.json();
        const errorMessage =
          data?.message || "Something went wrong. Please try again later.";
        toast.error(errorMessage);
        console.error("Error response:", data);
        return;
      }

      const data = await response.json();
      if (data?.message) {
        toast.success(data.message);
        console.log("Subscription canceled successfully:", data);
        setCancelExplanation("")
        onOpenChange(); 
      } else {
        toast.error("Unexpected response received.");
        console.error("Unexpected response format:", data);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
      console.error("Unexpected error:", error);
    }
  };
   debugger
  return (
    <div className="h-full w-full flex flex-col items-center overflow-y-scroll">
      <div className="w-[82%] h-[180px] mx-auto bg-white rounded mt-20">
        <h1 className="px-5 py-3 text-standard font-bold">Your Plan Detail</h1>
        <hr
          style={{ height: "2px", backgroundColor: "#E4E4E7", border: "none" }}
        />

        <div className="flex justify-between my-10 px-5">
          <h1 className="flex w-full justify-between text-standard">
            {activePlanDetail?.subscriptionDetails?.planName} – {activePlanDetail?.questionLimitDetails?.totalAllowedQuestions} questions
            {role == "Admin" && `- EUR ${activePlanDetail?.subscriptionDetails?.planPrice} per ${activePlanDetail?.subscriptionDetails?.billingCycle} not including VAT`}
            <span className="text-blue-700 text-standard">
              {activePlanDetail?.questionLimitDetails?.questionsLeft} question left
            </span>
          </h1>

          {/* {role == "Admin" && (
            <h1
              className="underline cursor-pointer text-standard"
              onClick={onOpen} 
            >
              Change Plan
            </h1>
          )} */}
        </div>
      </div>
      {role == "Admin" && (
        <div className="flex flex-col w-[82%]">
          <div
            className="flex gap-3 items-center mt-10 ml-10 cursor-pointer w-max"
            onClick={() => setIsChangePlanClick(!isChangePlanClick)}
          >
            <p className="text-standard">Change plan</p>
            <Image
              src={
                isChangePlanClick ? "/icons/headDown.svg" : "/icons/headUp.svg"
              }
              alt="down"
              width={18}
              height={18}
            />
          </div>
          {isChangePlanClick && <ChangeSubscription />}
          <div className="flex justify-end mt-7 mx-auto mr-5">
            <p className="text-standard cursor-pointer" onClick={onOpen}>
              Cancel Subscription
            </p>
          </div>
        </div>
      )}
      <CancelSubscriptionModal
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        setCancelExplanation={setCancelExplanation}
        cancelExplanation={cancelExplanation}
        cancelSubscription={cancelSubscription}
      />
    </div>
  );
};

export default Subscription;
