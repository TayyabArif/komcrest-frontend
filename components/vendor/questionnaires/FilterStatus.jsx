import React, { useState } from "react";
import QuestionnairCard from "./QuestionnairCard";
import { DndProvider, useDrop } from 'react-dnd';
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { handleResponse } from "@/helper"; 
import { toast } from "react-toastify";

const FilterStatus = ({ data, title, stepsContent, setDataUpdate ,questionnaireProgressBar}) => {
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  

  const [{ isOver }, drop] = useDrop({
    accept: 'CARD',
    drop: (item) => handleDrop(item, title),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const handleDrop = (item, title) => {
    const jsonPayload = JSON.stringify({
      status : title
      });
    const token = cookiesData.token;
    let requestOptions = {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: jsonPayload,
      redirect: "follow",
    };
  
    
      fetch(`${baseUrl}/questionnaires/${item.id}`, requestOptions)
        .then(async (response) => {
          const data = await handleResponse(response, router, cookies, removeCookie);
          return {
            status: response.status,
            ok: response.ok,
            data,
          };
        })
        .then(({ status, ok, data }) => {
          if (ok) {
            toast.success(data.message);
            setDataUpdate((prev)=>!prev)
          } else {
            toast.error(data?.error || "Questionnaires status not Updated");
            console.error("Error:", data);
          }
        })
        .catch((error) => {
          if (error.response) {
            console.error("API Error:", error.response);
            toast.error(error.response.data?.error || "An error occurred while Updated  Questionnaires status");
          }
        });
  }

  return (
    <div className="w-full h-[60vh]">
      <div  ref={drop} className=" flex-1  space-y-4 h-full rounded-md"
      style={{
        backgroundColor: isOver ? '#F9FAFB' : '',
      }}>
        <div className="flex gap-3 items-center border-2 py-[6px] px-2 rounded-lg bg-white">
          <span
            className={`flex items-center justify-center rounded-full w-[27px] h-[27px] text-center border-2 bg-[#EBEEF2]`}
          >
            {data.length}
          </span>
          <h1 className="text-[16px] 2xl:text-[20px]">{title}</h1>
        </div>
        {data?.length > 0 ? (
          data.map((data ,index) => {
            return <QuestionnairCard key={index} data={data} index={index} setDataUpdate={setDataUpdate} id={data.id} />;
          })
        ) : (
          <h1 className="px-2 text-[15px] 2xl:text-[20px]">{stepsContent}</h1>
        )}
      </div>
    </div>
  );
};

export default FilterStatus;
