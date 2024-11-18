import React, { useState } from "react";
import QuestionnairCard from "./QuestionnairCard";
import { DndProvider, useDrop } from 'react-dnd';
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { handleResponse } from "@/helper"; 
import { toast } from "react-toastify";

const FilterStatus = ({ data, title, stepsContent, setDataUpdate ,questionnaireProgressBar ,onCardDrop ,divHeight}) => {
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  
  const [{ isOver }, dropRef] = useDrop({
    accept: 'QUESTIONNAIRE_CARD',
    drop: (item) => {
      onCardDrop(item.id, title); // Call the drop function
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(), // Highlight column when dragging over
    }),
  });

  return (
    <div style={{ height: `${divHeight-30}px` }}  className="w-full flex flex-col" >
      <div  ref={dropRef} className="space-y-4 flex-1 rounded-md"
      style={{
        backgroundColor: isOver ? '#F9FAFB' : '',
      }}>
        <div className="flex gap-3 items-center border-2 py-[6px] px-2 rounded-md bg-white   sticky top-0  z-50">
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
