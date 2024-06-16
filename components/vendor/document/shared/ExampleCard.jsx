import React from "react";
import { useRouter } from "next/router";
const ExampleCard = () => {
  const router = useRouter()
  const ExampleData = [
       
    {
      title: "SOC 2 TYPE II REPORT",
    },
   
    {
      title: "ISO 27001 Statement",
    
    },
    {
      title: "Penetration Test Summary",
    
    },
    {
      title: "System architecture and data flow diagram",
    
    },
    {
      title: "Data Processing Agreement",
     
    },
    {
      title: "SA CAIQ",
     
    },
    {
      title: "SIG or SIG Lite",
    
    },
    {
        title: "Security Whitepaper",
       
      },
  ];
  return (
    <div>
      <div className="flex justify-evenly flex-wrap w-[70%] mx-auto">
        {ExampleData &&
          ExampleData.map((item, index) => {
            return (
              <div
                key={index}
                className="w-[180px] h-[130px] bg-white rounded-lg  my-4 flex flex-col justify-between mx-2"
              >
                <div className=" text-left px-4 py-5">
                  <h1 className="text-[14px] font-bold">{item.title}</h1>
                </div>

                <div className="flex justify-between items-center border-t-2 py-2 px-2">
                  <span  onClick={() => {
                router.push("/vendor/document/AddDocument");
              }} className="text-[13px] text-blue-600 cursor-pointer">Upload</span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ExampleCard;
