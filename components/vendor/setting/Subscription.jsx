import React from "react";
import { useDisclosure } from "@nextui-org/react";
import ChangeSubscriptionModal from "./ChangeSubscriptionModal";
import { useCookies } from "react-cookie";

const Subscription = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [cookies] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const role = cookiesData?.role;

  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="w-[82%] h-[600px] mx-auto bg-white rounded-sm">
        <h1 className="px-5 py-3 font-bold">Your Plan Detail</h1>
        <hr
          style={{ height: "2px", backgroundColor: "#D8D8D8", border: "none" }}
        />

        <div className="flex justify-between my-10 px-5">
          <h1 className="flex flex-col">
            Standard – 2 000 questions
            {role == "Admin" && " - EUR 199 per month not including VAT"}
            <span className="text-blue-700">1340 question left</span>
          </h1>

          {role == "Admin" && (
            <h1
              className="underline cursor-pointer"
              onClick={onOpen} 
            >
              Change Plan
            </h1>
          )}
        </div>
      </div>
      <ChangeSubscriptionModal
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};

export default Subscription;
