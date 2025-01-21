import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { CircleCheckBig } from "lucide-react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { useMyContext } from "@/context";
import { MdOutlineEuroSymbol } from "react-icons/md";

const ChangeSubscription = () => {
  const { plansData , activePlanDetail} = useMyContext();
  const [billingType, setBillingType] = useState("monthly");
  const [isLoading, setIsLoading] = useState({
    success: false,
    id: ""
  })
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  const handleCreateCheckout = async (data) => {
    try {
      setIsLoading({
        success: true,
        id: data.id
      })
      const item = {
        priceId: data?.billingCycle === "monthly" ? data?.monthlyStripePriceId : data?.yearlyStripePriceId,
        billingCycle: data?.billingCycle,
        plan_id: data?.id
      }
      const token = cookiesData?.token;
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({item}),
        redirect: "follow",
      };

      const response = await fetch(`${baseUrl}/stripe/create-checkout`, requestOptions);

      const createdSession = await response.json()
      if (response.ok) {
        // toast.success(data.message);
        console.log(">>>>>>>>>>>>",createdSession?.session?.url)
        window.open(createdSession?.session?.url, "_blank");
      } else {
        toast.error(createdSession?.message);
      }
    } catch (error) {
      toast.error("error");
      console.error("Error updating Resource:", error);
    } finally{
      setIsLoading({
        success: false,
        id: ""
      })
    }
  }
  return (
    <div className="w-full">
      <div className="flex gap-6 ml-10 my-2">
        <button
          className={`px-4 py-2 text-standard cursor-pointer border-b-2 ${
            billingType === "monthly" ? "border-blue-700" : "border-transparent"
          }`}
          onClick={() => setBillingType("monthly")}
        >
          Monthly
        </button>
        <button
          className={`px-4 py-2 text-standard cursor-pointer border-b-2 ${
            billingType === "annual" ? "border-blue-700" : "border-transparent"
          }`}
          onClick={() => setBillingType("annual")}
        >
          Annual
        </button>
      </div>
      <div className="">
        <div className="flex flex-wrap  gap-x-[30px] gap-y-4 w-[100%] mx-auto">
          {plansData
            ?.filter(
              (item) =>
                item.billingCycle == billingType
            )
            .sort((a, b) => a.id - b.id)
            .map((data, index) => (
              <div
                key={index}
                style={{ backgroundColor: data.cardColor }}
                className="w-[31%] p-4 bg-white group rounded-md lg:hover:-translate-y-1 ease-in duration-300 border xl:border-none border-[#0B0641]"
              >
                <div className="flex flex-row gap-5 items-center">
                  <span className="text-xl font-bold mb-5">{data.name}</span>
                </div>
                <div className="my-0 space-y-3">
                  <p className=" text-standard flex items-center gap-2 leading-6">
                    <div>
                    <CircleCheckBig size={22} /> 
                    </div>
                    {data.benefits?.Questions}{" "}
                    Questions / automated answer
                  </p>
                  <p className=" text-standard flex items-center gap-2 leading-6">
                  <div>
                    <CircleCheckBig size={22} /> 
                    </div>{data.benefits?.Questionnaires}{" "}
                    Questionnaires
                  </p>
                  <p className=" text-standard flex items-center gap-2 leading-6">
                  <div>
                    <CircleCheckBig size={22} /> 
                    </div> Answers from the market-leading LLM
                  </p>
                  <p className=" text-standard flex items-center gap-2 leading-6">
                  <div>
                    <CircleCheckBig size={22} /> 
                    </div> Unlimited resources and knowledge base entries
                  </p>
                  <p className=" text-standard flex items-center gap-2 leading-6">
                  <div>
                    <CircleCheckBig size={22} /> 
                    </div> {data.name =="Professionnel" ? "Priority support" : "Standard support"}
                  </p>
                </div>
                <div className="border border-dashed border-[#A9A9AA] tracking-widest my-4" />

                <div className="bottom-6 left-6 right-6 ">
                  <div className="flex justify-between items-center">
                    <span className="text-[20px] font-semibold flex items-center">< MdOutlineEuroSymbol /> {data.price} per month excl. VAT</span>

                    {data.planType !== "free" && (
                      <Button
                        size="md"
                        color="primary"
                        className="global-success-btn"
                        isLoading = {isLoading?.success && isLoading?.id === data?.id}
                        isDisabled = {activePlanDetail?.subscriptionDetails?.planId == data.id}
                        onPress={() => handleCreateCheckout(data)}
                      >
                        {activePlanDetail?.subscriptionDetails?.planId == data.id ? "Activated" : "Upgrade"}
                        
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ChangeSubscription;
