import React, { useState } from "react";
import { useDisclosure } from "@nextui-org/react";
import ChangeSubscriptionModal from "./ChangeSubscriptionModal";
import { useCookies } from "react-cookie";
import ChangeSubscription from "./ChangeSubscription";
import Image from "next/image";
import CancelSubscriptionModal from "./CancelSubscriptionModal";

const Subscription = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isChangePlanClick, setIsChangePlanClick] = useState(false)
  const [cancelEplaination, setCancelEplaination] = useState("")
  const [cookies] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const role = cookiesData?.role;

  return (
    <div className="h-full w-full flex flex-col items-center overflow-y-scroll">
      <div className="w-[82%] h-[180px] mx-auto bg-white rounded mt-20">
        <h1 className="px-5 py-3 text-standard font-bold">Your Plan Detail</h1>
        <hr
          style={{ height: "2px", backgroundColor: "#E4E4E7", border: "none" }}
        />

        <div className="flex justify-between my-10 px-5">
          <h1 className="flex w-full justify-between text-standard">
            Standard – 2 000 questions
            {role == "Admin" && " - EUR 199 per month not including VAT"}
            <span className="text-blue-700 text-standard">1340 question left</span>
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
      {role == "Admin" &&
        <div className="flex flex-col w-[82%]">
          <div className="flex gap-3 items-center mt-10 ml-10 cursor-pointer w-max" onClick={() => setIsChangePlanClick(!isChangePlanClick)}>
            <p className="text-[20px]">Change plan</p>
            <Image src ={isChangePlanClick ? "/icons/headDown.svg" : "/icons/headUp.svg"} alt = "down" width={20} height={20} />
          </div>
          {isChangePlanClick &&
            <ChangeSubscription/>
          }
          <div className="flex justify-end mt-7 mx-auto mr-5">
          <p className="text-[20px] cursor-pointer" onClick={onOpen}>Cancel Subscription</p>
          </div>
        </div>
      }
      <CancelSubscriptionModal
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        setCancelEplaination={setCancelEplaination}
        cancelEplaination = {cancelEplaination}
      />
    </div>
  );
};

export default Subscription;
