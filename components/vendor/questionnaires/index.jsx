import React, { useEffect, useState } from "react";
import KnowledgeHeader from "../shared/KnowledgeHeader";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { handleResponse } from "../../../helper";
import FilterStatus from "./FilterStatus";
import QuestionnairCard from "./QuestionnairCard";
import { QuestionnaireStepsContent } from "@/constants";
import { CircularProgress} from "@nextui-org/react";

import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// import DragCard from "./DragCard" 

const headerData = {
  title: "Questionnaires",
  desc1:
    "Streamline the process of responding to complex IT security assessments thanks to our AI-powered assistant.",
  desc2:
    "Upload your questionnaire and Komcrest will provides accurate and tailored answers, saving time and ensuring consistency.",
  addSingle: "Add questionnaire",
  singlePath: "/vendor/questionnaires/import",
};

const Questionnaires = () => {
  const [filterValue , setFilterValue] = useState("progress")
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [dataUpdate , setDataUpdate] = useState(false)
  const [questionnaireList , setQuestionnaireList] = useState([])
  const [questionnaireProgressBar ,setQuestionnaireProgressBar] = useState({})
  const [dataLoaded , setDataLoaded] = useState(false)


  
  const fetchAllQuestionnaires = async () => {
    const token = cookiesData && cookiesData.token;
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };

    try {
      const response = await fetch(`${baseUrl}/questionnaires`, requestOptions);
      const data = await handleResponse(
        response,
        router,
        cookies,
        removeCookie
      );
      if (response.ok) {
        setQuestionnaireList(data.questionnaires);
        setDataLoaded(true)
      } else {
        toast.error(data?.error);
      }
    } catch (error) {
      console.error("Error fetching Questionnaire:", error);
    }
  };

  useEffect(() => {
    fetchAllQuestionnaires();
  }, [dataUpdate]);

  const filterStatus = (status) => {
    const filteredData = questionnaireList?.filter(
      (item) => item.status === status
    );
    return filteredData;
  };

  return (
    <>
  {dataLoaded ? (
    <div>
      <KnowledgeHeader headerData={headerData} buttonShow={true} />
      <div className="w-[86%] mx-auto py-2 px-2">
        <div className="flex gap-5 text-[16px] 2xl:text-[20px] py-2 ">
          <h1 className={`${filterValue == "progress" ? "text-blue-700 " : ""} cursor-pointer`}
          onClick={()=>setFilterValue("progress")}
          
          >In progress</h1>
          <h1 className={`${filterValue == "completed" ? "text-blue-700 " : ""} cursor-pointer`}
          onClick={()=>setFilterValue("completed")}>Completed</h1>
        </div>
        {filterValue == "progress" ? (
         
          <div className="flex gap-3">
          <DndProvider backend={HTML5Backend}>
          <FilterStatus title="To Process" data={filterStatus("To Process")} stepsContent={QuestionnaireStepsContent.process} setDataUpdate={setDataUpdate} />
          <FilterStatus title="Started" data={filterStatus("Started")} stepsContent={QuestionnaireStepsContent.Started}  setDataUpdate={setDataUpdate} />
          <FilterStatus title="For Review" data={filterStatus("For Review")} stepsContent={QuestionnaireStepsContent.Review} setDataUpdate={setDataUpdate} />
          <FilterStatus title="Approved" data={filterStatus("Approved")} stepsContent={QuestionnaireStepsContent.Approved} setDataUpdate={setDataUpdate} />
          </DndProvider>
        </div>
       
        ): 
        <div className="flex flex-wrap gap-5">
          {filterStatus("Completed")?.map((data, index)=>{
            return(
              <DndProvider backend={HTML5Backend}>
              <QuestionnairCard  key={index} data={data} setDataUpdate={setDataUpdate} dataUpdate={dataUpdate}/>
              </DndProvider>
            )
          })}
        </div>
        }
        
      </div>
    </div>
  ):
  <div className='flex flex-col gap-2 bg-gray-200 items-center justify-center pl-20 pr-10 py-3 min-h-screen'>
    <CircularProgress label="Fetching Questionnaires..." size="lg" />
  </div>}
    
    </>
  );
};

export default Questionnaires;
